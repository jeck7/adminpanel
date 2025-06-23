import React, { useState, useEffect } from 'react';
import { userService } from '../services/userService';
import { authService } from '../services/authService';

// Edit User Modal Component
const EditUserModal = ({ isOpen, onClose, onUserUpdated, user }) => {
    const [formData, setFormData] = useState({ id: '', firstname: '', lastname: '', email: '', role: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                id: user.id,
                firstname: user.firstname || '',
                lastname: user.lastname || '',
                email: user.email || '',
                role: user.role || 'USER',
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            // We only send the fields that can be updated
            const { firstname, lastname, role } = formData;
            await userService.updateUser(formData.id, { firstname, lastname, role });
            onUserUpdated();
            onClose();
        } catch (err) {
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-8 w-full max-w-md text-gray-800">
                <h2 className="text-2xl font-bold mb-6">Edit User</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && <div className="text-red-500 bg-red-100 p-3 rounded">{error}</div>}
                    <input name="firstname" value={formData.firstname} onChange={handleChange} placeholder="First Name" required className="w-full p-2 border rounded" />
                    <input name="lastname" value={formData.lastname} onChange={handleChange} placeholder="Last Name" required className="w-full p-2 border rounded" />
                    <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email" required disabled className="w-full p-2 border rounded bg-gray-200" />
                    <select name="role" value={formData.role} onChange={handleChange} className="w-full p-2 border rounded">
                        <option value="USER">USER</option>
                        <option value="ADMIN">ADMIN</option>
                    </select>
                    <div className="flex justify-end space-x-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-300">Cancel</button>
                        <button type="submit" disabled={loading} className="px-4 py-2 rounded bg-blue-500 text-white disabled:bg-blue-300">
                            {loading ? 'Updating...' : 'Update User'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Create User Modal Component
const CreateUserModal = ({ isOpen, onClose, onUserCreated }) => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        role: 'USER',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await userService.createUser(formData);
            onUserCreated();
            onClose();
        } catch (err) {
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };
    
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-8 w-full max-w-md text-gray-800">
                <h2 className="text-2xl font-bold mb-6">Create New User</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && <div className="text-red-500 bg-red-100 p-3 rounded">{error}</div>}
                    <input name="username" value={formData.username} onChange={handleChange} placeholder="Username" required className="w-full p-2 border rounded" />
                    <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Password" required className="w-full p-2 border rounded" />
                    <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email" required className="w-full p-2 border rounded" />
                    <select name="role" value={formData.role} onChange={handleChange} className="w-full p-2 border rounded">
                        <option value="USER">USER</option>
                        <option value="ADMIN">ADMIN</option>
                    </select>
                    <div className="flex justify-end space-x-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-300">Cancel</button>
                        <button type="submit" disabled={loading} className="px-4 py-2 rounded bg-blue-500 text-white disabled:bg-blue-300">
                            {loading ? 'Creating...' : 'Create User'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Confirm Delete Modal Component
const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, userName }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-8 w-full max-w-md text-gray-800 shadow-xl">
                <h2 className="text-2xl font-bold mb-4">Confirm Deletion</h2>
                <p className="mb-6">
                    Are you sure you want to delete the user <strong>{userName}</strong>? This action cannot be undone.
                </p>
                <div className="flex justify-end space-x-4">
                    <button onClick={onClose} className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400">
                        Cancel
                    </button>
                    <button onClick={onConfirm} className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700">
                        Confirm Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const userRole = authService.getUserRole();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getUsers();
      setUsers(data);
    } catch (error) {
      setError('Failed to fetch users');
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const openEditModal = (user) => {
    setUserToEdit(user);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setUserToEdit(null);
    setIsEditModalOpen(false);
  };
  
  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setUserToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;

    try {
        await userService.deleteUser(userToDelete.id);
        fetchUsers(); // Refresh list after delete
    } catch (err) {
        setError(err.message || 'Failed to delete user');
    } finally {
        closeDeleteModal();
    }
  };
  
  const handleUserCreatedOrUpdated = () => {
      fetchUsers(); // Refresh the user list
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading users...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-700 bg-red-100 rounded">
        {error}
      </div>
    );
  }

  return (
    <div>
        <CreateUserModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onUserCreated={handleUserCreatedOrUpdated} />
        <EditUserModal 
            isOpen={isEditModalOpen}
            onClose={closeEditModal}
            onUserUpdated={handleUserCreatedOrUpdated}
            user={userToEdit}
        />
        <ConfirmDeleteModal
            isOpen={isDeleteModalOpen}
            onClose={closeDeleteModal}
            onConfirm={handleDeleteConfirm}
            userName={userToDelete?.username}
        />
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Users</h1>
            {userRole === 'ADMIN' && (
                <button onClick={() => setIsCreateModalOpen(true)} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    + Create User
                </button>
            )}
        </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                First Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              {userRole === 'ADMIN' && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.firstname}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.lastname}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.role}
                </td>
                {userRole === 'ADMIN' && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4">
                        <button
                            onClick={() => openEditModal(user)}
                            className="text-indigo-600 hover:text-indigo-900"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => openDeleteModal(user)}
                            className="text-red-600 hover:text-red-900 cursor-pointer disabled:text-gray-400 disabled:cursor-not-allowed"
                            disabled={user.email === 'admin@example.com'}
                        >
                            Delete
                        </button>
                    </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {users.length === 0 && (
        <div className="mt-4 text-center text-gray-500">
          No users found
        </div>
      )}
    </div>
  );
};

export default Users;
