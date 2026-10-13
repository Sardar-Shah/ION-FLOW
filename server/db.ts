import mongoose from 'mongoose';

export interface DatabaseStatus {
  connected: boolean;
  status: 'connected' | 'connecting' | 'disconnected' | 'missing_uri' | 'error';
  databaseName?: string;
  host?: string;
  message: string;
  actionRequired?: string;
}

let cachedStatus: DatabaseStatus = {
  connected: false,
  status: 'disconnected',
  message: 'Database connection not initialized'
};

/**
 * Safely normalizes the MongoDB URI by percent-encoding username and password credentials
 * if they contain unencoded reserved characters (such as '@', ':', '#', etc.) as required
 * by RFC 3986 and MongoDB connection string specifications.
 */
export function normalizeMongoUri(rawUri: string): string {
  const trimmed = rawUri.trim();
  const prefixMatch = trimmed.match(/^(mongodb(?:\+srv)?:\/\/)/);
  if (!prefixMatch) return trimmed;
  const prefix = prefixMatch[1];
  const rest = trimmed.slice(prefix.length);
  const lastAtIndex = rest.lastIndexOf('@');
  if (lastAtIndex === -1) return trimmed;

  const userInfo = rest.slice(0, lastAtIndex);
  const hostAndQuery = rest.slice(lastAtIndex + 1);

  const colonIndex = userInfo.indexOf(':');
  if (colonIndex === -1) return trimmed;

  const username = userInfo.slice(0, colonIndex);
  const password = userInfo.slice(colonIndex + 1);

  const safeDecode = (str: string) => {
    try {
      return decodeURIComponent(str);
    } catch {
      return str;
    }
  };

  const encodedUser = encodeURIComponent(safeDecode(username));
  const encodedPass = encodeURIComponent(safeDecode(password));

  return `${prefix}${encodedUser}:${encodedPass}@${hostAndQuery}`;
}

export async function connectDB(): Promise<DatabaseStatus> {
  const uri = process.env.MONGODB_URI?.trim();

  if (!uri) {
    cachedStatus = {
      connected: false,
      status: 'missing_uri',
      message: 'MONGODB_URI environment variable is not defined.',
      actionRequired:
        'Please add your MONGODB_URI in Google AI Studio Server Secrets: mongodb+srv://<DB_USERNAME>:<NEW_PASSWORD>@ionflow.skdrbqo.mongodb.net/careerpath_ai?appName=IONFLOW'
    };
    console.warn(`[MongoDB] ${cachedStatus.message}`);
    return cachedStatus;
  }

  // Sanitize host for logging without exposing credentials
  let safeHost = 'ionflow.skdrbqo.mongodb.net';
  try {
    const afterLastAt = uri.slice(uri.lastIndexOf('@') + 1);
    const hostPart = afterLastAt.split('/')[0]?.split('?')[0];
    if (hostPart) safeHost = hostPart;
  } catch {
    // fallback
  }

  try {
    cachedStatus = {
      connected: false,
      status: 'connecting',
      host: safeHost,
      message: `Connecting to MongoDB Atlas cluster at ${safeHost}...`
    };
    console.log(`[MongoDB] Connecting to cluster (${safeHost})...`);

    // Configure mongoose
    mongoose.set('strictQuery', true);
    mongoose.set('bufferCommands', false);

    const connectionUri = normalizeMongoUri(uri);

    await mongoose.connect(connectionUri, {
      dbName: 'careerpath_ai',
      serverSelectionTimeoutMS: 8000,
      connectTimeoutMS: 10000,
      retryWrites: true,
      w: 'majority'
    });

    cachedStatus = {
      connected: true,
      status: 'connected',
      databaseName: 'careerpath_ai',
      host: safeHost,
      message: `Successfully connected to MongoDB Atlas database 'careerpath_ai' on ${safeHost}`
    };

    console.log(`[MongoDB] ${cachedStatus.message}`);

    mongoose.connection.on('disconnected', () => {
      console.warn('[MongoDB] Connection lost to MongoDB Atlas');
      cachedStatus = {
        connected: false,
        status: 'disconnected',
        databaseName: 'careerpath_ai',
        host: safeHost,
        message: 'MongoDB Atlas connection lost. Attempting reconnection...'
      };
    });

    mongoose.connection.on('error', (err) => {
      console.error('[MongoDB] Runtime connection error:', err.message);
      cachedStatus = {
        connected: false,
        status: 'error',
        databaseName: 'careerpath_ai',
        host: safeHost,
        message: `Database error: ${err.message}`,
        actionRequired: 'Verify MongoDB Atlas Network Access whitelist (allow 0.0.0.0/0) and credentials.'
      };
    });

    return cachedStatus;
  } catch (error: any) {
    const errMsg = error?.message || 'Unknown database connection error';
    const errName = error?.name || '';
    const errCode = error?.code;

    let errorCategory: 'authentication' | 'network/DNS' | 'missing environment variable' | 'application code' = 'network/DNS';
    let actionRequired = 'Verify MongoDB Atlas Network Access IP Whitelist (0.0.0.0/0) and connection string.';

    // Accurate classification
    if (
      errCode === 18 ||
      errMsg.toLowerCase().includes('auth') ||
      errMsg.toLowerCase().includes('authentication') ||
      errMsg.toLowerCase().includes('bad auth') ||
      errMsg.toLowerCase().includes('not authorized') ||
      errMsg.toLowerCase().includes('user not found')
    ) {
      errorCategory = 'authentication';
      actionRequired = 'Database authentication failed. Verify MongoDB Atlas user "careerpath_app" password and permissions for database "careerpath_ai".';
    } else if (
      errMsg.includes('getaddrinfo') ||
      errMsg.includes('ENOTFOUND') ||
      errMsg.includes('querySrv ENOTFOUND')
    ) {
      errorCategory = 'network/DNS';
      actionRequired = 'DNS resolution failed. Verify the cluster hostname in MONGODB_URI (ionflow.skdrbqo.mongodb.net).';
    } else if (
      errMsg.includes('ETIMEDOUT') ||
      errMsg.includes('timed out') ||
      errMsg.includes('Could not connect to any servers') ||
      errMsg.includes('Server selection timed out')
    ) {
      errorCategory = 'network/DNS';
      actionRequired = 'Cluster unreachable or connection timed out. Ensure MongoDB Atlas Network Access allows connections (0.0.0.0/0).';
    } else if (error instanceof TypeError || errName === 'SyntaxError' || errName === 'RangeError') {
      errorCategory = 'application code';
      actionRequired = 'Application error in database connection configuration. Review connection logic.';
    }

    cachedStatus = {
      connected: false,
      status: 'error',
      host: safeHost,
      message: `[${errorCategory}] ${errMsg}`,
      actionRequired
    };

    console.error(`[MongoDB] Connection error [Category: ${errorCategory}]:`, errMsg);

    return cachedStatus;
  }
}

export function getDatabaseStatus(): DatabaseStatus {
  if (mongoose.connection.readyState === 1) {
    return {
      connected: true,
      status: 'connected',
      databaseName: 'careerpath_ai',
      host: cachedStatus.host || 'ionflow.skdrbqo.mongodb.net',
      message: 'MongoDB Atlas connected and operational'
    };
  }
  return cachedStatus;
}

