import { getUsersAction, deleteUserAction, restoreUserAction } from '@/actions/users.actions';

export default async function HomePage() {
  const { data: users, isGod } = await getUsersAction();
  if (!users) return 'Data Not Found';

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <header className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold">User Management</h1>
        {isGod && (
          <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg animate-pulse">
            ⚡ GOD MODE ACTIVE
          </span>
        )}
      </header>

      <div className="grid gap-4">
        {users?.map((user: unknown) => (
          <div
            key={user._id}
            className={`p-4 border rounded-lg flex justify-between items-center transition-all ${
              user.isDeleted
                ? 'bg-red-50 border-red-200 opacity-75'
                : 'bg-white border-gray-200 hover:shadow-md'
            }`}
          >
            <div>
              <h3
                className={`font-semibold text-lg ${user.isDeleted ? 'text-red-800 line-through' : 'text-gray-800'}`}
              >
                {user.name}
              </h3>
              <p className="text-gray-500 text-sm">{user.email}</p>
              {user.isDeleted && (
                <p className="text-xs text-red-600 font-mono mt-1">Deleted by: {user.deletedBy}</p>
              )}
            </div>

            <div className="flex gap-2">
              {/* RESTORE BUTTON - Only visible for deleted users in God Mode */}
              {isGod && user.isDeleted && (
                <form action={restoreUserAction.bind(null, user._id)}>
                  <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-medium text-sm">
                    Restore ♻️
                  </button>
                </form>
              )}

              {/* DELETE BUTTON - Only visible if NOT deleted */}
              {!user.isDeleted && (
                <form action={deleteUserAction.bind(null, user._id)}>
                  <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 font-medium text-sm">
                    Delete 🗑️
                  </button>
                </form>
              )}
            </div>
          </div>
        ))}

        {users?.length === 0 && (
          <div className="text-center p-10 text-gray-400">No users found.</div>
        )}
      </div>
    </div>
  );
}
