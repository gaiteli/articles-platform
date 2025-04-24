const { MeiliSearch } = require("meilisearch");
const  client = new MeiliSearch({
  host: "http://127.0.0.1:7700",
  apiKey: "Per4CS-nqIOaleb0fWQG_wrGqo5bqLiEHKffZFW_KtQ",
})

// 文章索引
const articlesIndex = client.index('articles');

async function setupMeilisearch() {
  try {
    // 用于搜索的字段
    await articlesIndex.updateSearchableAttributes([
      'title',
      'content',
    ]);

    // 自定义排序规则
    await articlesIndex.updateSortableAttributes([
      'createdAt',
      'updatedAt',
      'readCount',
      'likeCount'
    ]);

    // 可过滤的属性(filter需要)
    await articlesIndex.updateFilterableAttributes([
      'status',
      'userId',
      'channelId',
      'createdAt'
    ]);

    // 排序权重顺序
    await articlesIndex.updateRankingRules([
      'sort',
      'words',
      'typo',
      'proximity',
      'attribute',
      'exactness',
    ]);

    console.log('Meilisearch index configured successfully');
  } catch (error) {
    console.error('Meilisearch configuration error:', error);
  }
}

// 增加或重建文章索引
async function indexArticle(article) {
  try {
    await articlesIndex.addDocuments([article]);
    console.log(`Article ${article.id} indexed successfully`);
  } catch (error) {
    console.error(`Error indexing article ${article.id}:`, error);
  }
}

// 删除文章索引
async function deleteArticleFromIndex(articleId) {
  try {
    await articlesIndex.deleteDocument(articleId);
    console.log(`Article ${articleId} deleted from index`);
  } catch (error) {
    console.error(`Error deleting article ${articleId} from index:`, error);
  }
}

async function bulkIndexArticles(articles) {
  try {
    await articlesIndex.addDocuments(articles);
    console.log(`${articles.length} articles indexed successfully`);
  } catch (error) {
    console.error('Error bulk indexing articles:', error);
  }
}

// Initialize the index setup
setupMeilisearch();

module.exports = {
  articlesIndex,
  indexArticle,
  deleteArticleFromIndex,
  bulkIndexArticles
};