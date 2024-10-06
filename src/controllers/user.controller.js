
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const generateToken = require("../utils/generateToken")
const prisma = new PrismaClient();

const createUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        
        password: hashedPassword,
      },
    });
      
      const payload = {
          id: user.id,
          email:user.email
     }
      const token = generateToken(payload);
     
    res.status(201).json({ message: 'User created successfully', user,token:token });
  } catch (error) {
    res.status(500).json({ error: 'User creation failed', details: error.message });
  }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await prisma.user.findUnique({
            where: {email}
        })
        if (!user || !bcrypt.compare(password, user.password)) {
            return res.status(401).json({
                error:"Invalid email or passowrd"
            })
        }
       
           
      const payload = {
          id: user.id,
          email:user.email
     }
    const token = generateToken(payload); // Pass any required user data

    res.status(200).json({ message: 'Login successful', user: { email: user.email, name: user.name }, token });

    } catch (error) {
        return res.status(405).json({
            error
        })
    }
}

const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        posts: true,
        comments: true,
      },
    });

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users', details: error.message });
  }
};


const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        posts: true,
        comments: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user', details: error.message });
  }
};


const updateUser = async (req, res) => {
  const { id } = req.params;
  const { email, name, password } = req.body;

  try {
    const data = { email, name };

    if (password) {
      data.password = await bcrypt.hash(password, 10); // Hash the new password
    }

    const user = await prisma.user.update({
      where: { id },
      data,
    });

    res.status(200).json({ message: 'User updated successfully', user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user', details: error.message });
  }
};


const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.user.delete({
      where: { id },
    });

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user', details: error.message });
  }
};

module.exports = {
    createUser,
    login,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
