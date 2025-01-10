import express from 'express'
import {
  createMemoryLane,
  getMemoryLanes,
} from '../controllers/memoryLaneController.js'

const router = express.Router({ mergeParams: true })

router.post('/', createMemoryLane)
router.get('/', getMemoryLanes)

export default router
