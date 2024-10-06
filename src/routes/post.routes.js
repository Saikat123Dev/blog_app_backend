const express = require('express');
const postController = require('../controllers/post.controller'); // Adjust the path as necessary
const { authMiddleware } = require('../middleware/authMiddleware'); // Adjust the path as necessary

const router = express.Router();

// Post routes
router.post('/create', authMiddleware, postController.createPost); // Create post
router.get('/', postController.getAllPosts); // Get all posts
router.get('/:id',authMiddleware, postController.getPostById); // Get post by ID
router.put('/:id', authMiddleware, postController.updatePost); // Update post
router.delete('/:id', authMiddleware, postController.deletePost); // Delete post
router.post('/:postId/comments', authMiddleware, postController.createComment); // Create comment
router.get('/:postId/comments', postController.getCommentsForPost); // Get comments for a post

module.exports = router;
