import { getAllCategories, getCategoriesByProjectId, getCategoryById, getProjectsByCategoryId } from '../models/categories.js';

const categoryPage = async (req, res) => {
    const categories = await getAllCategories();
    const title = 'Categories';

    res.render('categories', { title, categories });
};

const showCatDetailsPage = async (req,res) => {
  const category_Id = req.params.id
  const catDetails = await getCategoryById(category_Id);
  const projDetails = await getProjectsByCategoryId(category_Id);
  console.log(catDetails.category_name);

  const title = catDetails.category_name;

  res.render('cat_details', {title, catDetails, projDetails});
};

export {categoryPage, showCatDetailsPage};