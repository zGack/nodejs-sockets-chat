import { Router } from 'express';
import { search } from '../controllers/search.js';

export const search_router = Router();

search_router.get('/:collection/:term', search);