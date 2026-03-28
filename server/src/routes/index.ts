import express from 'express';
import { register, login, getMe } from '../controllers/authController';
import {
  getTickets,
  getTicketById,
  createTicket,
  updateTicket,
  addComment,
  getTicketStats
} from '../controllers/ticketController';
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  addProjectUpdate,
  getProjectStats,
  getPublicProjects
} from '../controllers/projectController';
import {
  getBoards,
  getBoardById,
  createBoard,
  createCard,
  moveCard,
  updateCard,
  deleteCard
} from '../controllers/kanbanController';
import { getUsers } from '../controllers/userController';
import { authMiddleware, roleMiddleware } from '../middleware/auth';

const router = express.Router();

// Auth routes
router.post('/auth/register', register);
router.post('/auth/login', login);
router.get('/auth/me', authMiddleware, getMe);

// User routes
router.get('/users', authMiddleware, getUsers);

// Ticket routes
router.get('/tickets', authMiddleware, getTickets);
router.get('/tickets/stats', authMiddleware, getTicketStats);
router.get('/tickets/:id', authMiddleware, getTicketById);
router.post('/tickets', authMiddleware, createTicket);
router.patch('/tickets/:id', authMiddleware, updateTicket);
router.post('/tickets/:id/comments', authMiddleware, addComment);

// Public routes (no auth required)
router.get('/public/projects', getPublicProjects);

// Project routes
router.get('/projects', authMiddleware, getProjects);
router.get('/projects/stats', authMiddleware, getProjectStats);
router.get('/projects/:id', authMiddleware, getProjectById);
router.post('/projects', authMiddleware, roleMiddleware('admin', 'developer'), createProject);
router.patch('/projects/:id', authMiddleware, roleMiddleware('admin', 'developer'), updateProject);
router.post('/projects/:id/updates', authMiddleware, roleMiddleware('admin', 'developer'), addProjectUpdate);

// Kanban routes
router.get('/kanban/boards', authMiddleware, getBoards);
router.get('/kanban/boards/:id', authMiddleware, getBoardById);
router.post('/kanban/boards', authMiddleware, roleMiddleware('admin', 'developer'), createBoard);
router.post('/kanban/cards', authMiddleware, createCard);
router.patch('/kanban/cards/:id/move', authMiddleware, moveCard);
router.patch('/kanban/cards/:id', authMiddleware, updateCard);
router.delete('/kanban/cards/:id', authMiddleware, deleteCard);

export default router;
