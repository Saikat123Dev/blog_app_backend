const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create a new post
const createPost = async (req, res) => {
      console.log(req.userPaylod)
    const { title, content } = req.body;
    const { userPaylod } = req; // Accessing the user payload from the request
  
    try {
        const post = await prisma.post.create({
            data: {
                title,
                content,
                authorId: userPaylod.id, // Use the authenticated user's ID
            },
        });
        res.status(201).json({ message: 'Post created successfully', post });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create post', details: error.message });
    }
};

// Get all posts
const getAllPosts = async (req, res) => {
    try {
        const posts = await prisma.post.findMany({
            include: {
                author: true, // Include author information
                comments: true, // Include comments
            },
        });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch posts', details: error.message });
    }
};

// Get a post by ID
const getPostById = async (req, res) => {
    const { id } = req.params;

    try {
        const post = await prisma.post.findUnique({
            where: { id },
            include: {
                author: true, // Include author information
                comments: true, // Include comments
            },
        });

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch post', details: error.message });
    }
};

// Update a post by ID
const updatePost = async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;

    try {
        const post = await prisma.post.findUnique({ where: { id } });
        
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Check if the user is the author of the post
        if (post.authorId !== req.userPaylod.id) {
            return res.status(403).json({ error: 'You are not authorized to update this post' });
        }

        const updatedPost = await prisma.post.update({
            where: { id },
            data: { title, content },
        });

        res.status(200).json({ message: 'Post updated successfully', updatedPost });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update post', details: error.message });
    }
};

// Delete a post by ID
const deletePost = async (req, res) => {
    const { id } = req.params;

    try {
        const post = await prisma.post.findUnique({ where: { id } });

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Check if the user is the author of the post
        if (post.authorId !== req.userPaylod.id) {
            return res.status(403).json({ error: 'You are not authorized to delete this post' });
        }

        await prisma.post.delete({
            where: { id },
        });

        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete post', details: error.message });
    }
};

// Create a new comment for a post
const createComment = async (req, res) => {
    const { postId } = req.params; // Get postId from the URL
    const { content } = req.body; // Get comment content from request body
    const { userPaylod } = req; // Accessing the user payload from the request

    try {
        const comment = await prisma.comment.create({
            data: {
                content,
                postId,
                authorId: userPaylod.id, // Use the authenticated user's ID
            },
        });
        res.status(201).json({ message: 'Comment created successfully', comment });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create comment', details: error.message });
    }
};

// Get comments for a specific post
const getCommentsForPost = async (req, res) => {
    const { postId } = req.params; // Get postId from the URL

    try {
        const comments = await prisma.comment.findMany({
            where: { postId },
            include: {
                author: true, // Include author information for each comment
            },
        });
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch comments', details: error.message });
    }
};

module.exports = {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost,
    createComment,
    getCommentsForPost,
};
