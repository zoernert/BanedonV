import { Router } from 'express';
import { UnifiedSearchService } from '../../../../libs/search/src/unified-search.service';

const router = Router();
const searchService = new UnifiedSearchService();

router.post('/search', async (req, res) => {
  const { query } = req.body;
  const results = await searchService.hybridSearch(query);
  res.json(results);
});

export default router;
