/**
 * MongoDB Initialization Script
 * Database setup and user creation for multi-subdomain applications
 * 
 * @module MongoDBInit
 * @description MongoDB initialization for professional deployment
 */

// =============================================================================
// DATABASE AND COLLECTION CREATION
// =============================================================================

// Switch to the admin database
db = db.getSiblingDB('admin');

// Create admin user if it doesn't exist
try {
  db.createUser({
    user: "admin",
    pwd: "admin123", // Change this in production
    roles: [
      { role: "userAdminAnyDatabase", db: "admin" },
      { role: "readWriteAnyDatabase", db: "admin" },
      { role: "dbAdminAnyDatabase", db: "admin" }
    ]
  });
  print("Admin user created successfully");
} catch (err) {
  print("Admin user already exists or error: " + err.message);
}

// =============================================================================
// APPLICATION DATABASES
// =============================================================================

// Create main application database
const mainDb = db.getSiblingDB('winfoa');

// Create collections with proper validation
const collections = [
  {
    name: 'users',
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["email", "username", "role"],
        properties: {
          email: {
            bsonType: "string",
            pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
          },
          username: {
            bsonType: "string",
            minLength: 3,
            maxLength: 30
          },
          role: {
            enum: ["USER", "ADMIN", "SUPER_ADMIN", "MODERATOR"]
          },
          isActive: {
            bsonType: "bool"
          },
          createdAt: {
            bsonType: "date"
          },
          updatedAt: {
            bsonType: "date"
          }
        }
      }
    }
  },
  {
    name: 'sessions',
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["userId", "token"],
        properties: {
          userId: {
            bsonType: "objectId"
          },
          token: {
            bsonType: "string",
            minLength: 32
          },
          expiresAt: {
            bsonType: "date"
          },
          deviceInfo: {
            bsonType: "object"
          },
          geoInfo: {
            bsonType: "object"
          },
          isActive: {
            bsonType: "bool"
          }
        }
      }
    }
  },
  {
    name: 'wallet_transactions',
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["userId", "amount", "type", "status"],
        properties: {
          userId: {
            bsonType: "objectId"
          },
          amount: {
            bsonType: "decimal",
            minimum: 0
          },
          type: {
            enum: ["DEPOSIT", "WITHDRAWAL", "TRANSFER", "REFUND", "BONUS", "PENALTY"]
          },
          status: {
            enum: ["PENDING", "PROCESSING", "COMPLETED", "FAILED", "CANCELLED", "REFUNDED"]
          },
          createdAt: {
            bsonType: "date"
          }
        }
      }
    }
  },
  {
    name: 'notifications',
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["userId", "type", "title", "message"],
        properties: {
          userId: {
            bsonType: "objectId"
          },
          type: {
            enum: ["INFO", "WARNING", "ERROR", "SUCCESS", "SYSTEM"]
          },
          title: {
            bsonType: "string",
            maxLength: 200
          },
          message: {
            bsonType: "string",
            maxLength: 1000
          },
          isRead: {
            bsonType: "bool"
          },
          createdAt: {
            bsonType: "date"
          }
        }
      }
    }
  }
];

// Create collections
collections.forEach(collection => {
  try {
    mainDb.createCollection(collection.name, {
      validator: collection.validator,
      validationLevel: "strict",
      validationAction: "error"
    });
    print(`Collection ${collection.name} created successfully`);
  } catch (err) {
    print(`Collection ${collection.name} already exists or error: ${err.message}`);
  }
});

// =============================================================================
// INDEX CREATION
// =============================================================================

// Users collection indexes
mainDb.users.createIndex({ email: 1 }, { unique: true });
mainDb.users.createIndex({ username: 1 }, { unique: true });
mainDb.users.createIndex({ role: 1 });
mainDb.users.createIndex({ isActive: 1 });
mainDb.users.createIndex({ createdAt: -1 });

// Sessions collection indexes
mainDb.sessions.createIndex({ userId: 1 });
mainDb.sessions.createIndex({ token: 1 }, { unique: true });
mainDb.sessions.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
mainDb.sessions.createIndex({ "deviceInfo.deviceId": 1 });
mainDb.sessions.createIndex({ createdAt: -1 });

// Wallet transactions indexes
mainDb.wallet_transactions.createIndex({ userId: 1 });
mainDb.wallet_transactions.createIndex({ type: 1 });
mainDb.wallet_transactions.createIndex({ status: 1 });
mainDb.wallet_transactions.createIndex({ createdAt: -1 });
mainDb.wallet_transactions.createIndex({ userId: 1, createdAt: -1 });

// Notifications indexes
mainDb.notifications.createIndex({ userId: 1 });
mainDb.notifications.createIndex({ type: 1 });
mainDb.notifications.createIndex({ isRead: 1 });
mainDb.notifications.createIndex({ createdAt: -1 });
mainDb.notifications.createIndex({ userId: 1, isRead: 1 });

print("Indexes created successfully");

// =============================================================================
// SAMPLE DATA INSERTION
// =============================================================================

// Insert sample roles if they don't exist
const roles = mainDb.getSiblingDB('winfoa').roles;
try {
  roles.insertMany([
    {
      name: "USER",
      description: "Regular user with basic permissions",
      permissions: ["read:own", "update:own"],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: "ADMIN",
      description: "Administrator with elevated permissions",
      permissions: ["read:all", "update:all", "delete:all", "manage:users"],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: "SUPER_ADMIN",
      description: "Super administrator with all permissions",
      permissions: ["*"],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ], { ordered: false });
  print("Sample roles inserted successfully");
} catch (err) {
  print("Sample roles already exist or error: " + err.message);
}

// =============================================================================
// DATABASE USER CREATION
// =============================================================================

// Create application user with specific permissions
try {
  mainDb.createUser({
    user: "winfoa_app",
    pwd: "app_secure_password_123", // Change this in production
    roles: [
      {
        role: "readWrite",
        db: "winfoa"
      }
    ]
  });
  print("Application user created successfully");
} catch (err) {
  print("Application user already exists or error: " + err.message);
}

// Create read-only user for analytics
try {
  mainDb.createUser({
    user: "winfoa_analytics",
    pwd: "analytics_secure_password_123", // Change this in production
    roles: [
      {
        role: "read",
        db: "winfoa"
      }
    ]
  });
  print("Analytics user created successfully");
} catch (err) {
  print("Analytics user already exists or error: " + err.message);
}

// =============================================================================
// PERFORMANCE OPTIMIZATION
// =============================================================================

// Set database profiling level (0=off, 1=slow, 2=all)
mainDb.setProfilingLevel(1, { slowms: 100 });

// Enable slow query logging
mainDb.adminCommand({
  setParameter: 1,
  slowms: 100,
  profile: 1
});

print("Database profiling configured successfully");

// =============================================================================
// FINAL STATUS
// =============================================================================

print("\n=== MongoDB Initialization Complete ===");
print("Database: winfoa");
print("Collections created: " + collections.length);
print("Indexes created: Multiple");
print("Users created: 3 (admin, app, analytics)");
print("Sample data: Inserted");
print("Profiling: Enabled for queries > 100ms");
print("\nNext steps:");
print("1. Update passwords in production environment");
print("2. Configure connection strings in your application");
print("3. Set up backup strategies");
print("4. Configure monitoring and alerting");