let users = [
    {
        id: 1,
        name: "Anna Smith",
        email: "anna@example.com",
        role: "admin"
    },
    {
        id: 2,
        name: "John Doe",
        email: "john@example.com",
        role: "user"
    },
    {
        id: 3,
        name: "Maria Garcia",
        email: "maria@example.com",
        role: "user"
    },
    {
        id: 4,
        name: "Alex Johnson",
        email: "alex@example.com",
        role: "moderator"
    },
    {
        id: 5,
        name: "Sarah Wilson",
        email: "sarah@example.com",
        role: "user"
    }
];

let nextId = 6;

const getUsers = () => users;

const getUserById = (id) => users.find(user => user.id === parseInt(id));

const addUser = (userData) => {
    const newUser = {
        id: nextId++,
        ...userData
    };
    users.push(newUser);
    return newUser;
};

const updateUser = (id, updateData) => {
    const userIndex = users.findIndex(user => user.id === parseInt(id));
    if (userIndex === -1) return null;
    
    users[userIndex] = { ...users[userIndex], ...updateData };
    return users[userIndex];
};

const deleteUser = (id) => {
    const userIndex = users.findIndex(user => user.id === parseInt(id));
    if (userIndex === -1) return null;
    
    return users.splice(userIndex, 1)[0];
};

const getUsersByRole = (role) => {
    if (!role) return users;
    return users.filter(user => user.role === role);
};

module.exports = {
    getUsers,
    getUserById,
    addUser,
    updateUser,
    deleteUser,
    getUsersByRole
};
