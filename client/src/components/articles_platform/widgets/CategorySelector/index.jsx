import { useEffect, useState } from "react";
import { Cascader } from "antd";
import { getNestedChannelsAPI } from '/src/apis/articles_platform/channel';

const CategorySelector = ({ isVisible = false, filters, handleFilterChange }) => {
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);


  // 获取分类数据
  const fetchCategories = async () => {
    if (categories.length > 0 || categoriesLoading) return;

    setCategoriesLoading(true);
    try {
      const res = await getNestedChannelsAPI();
      setCategories(res.data);
    } catch (error) {
      message.error('获取分类失败');
    } finally {
      setCategoriesLoading(false);
    }
  };

  useEffect(() => {
    async function fetchData() {
      if (isVisible && categories.length === 0) {
        await fetchCategories();
      }
    }
    fetchData();
  }, [isVisible])


  return (
    <>
      <Cascader
        options={categories}
        loading={categoriesLoading}
        value={filters?.channel ? [filters.channel] : []}
        onChange={(value) => handleFilterChange('channel', value)}
        placeholder={categoriesLoading ? '加载中请稍后..' : '选择分类'}
        displayRender={labels => labels[labels.length - 1] || ''}
        expandTrigger="hover"
        changeOnSelect
        showSearch={{
          filter: (inputValue, path) =>
            path.some(option =>
              option.label.toLowerCase().includes(inputValue.toLowerCase())
            )
        }}
        style={{ width: '100%' }}
      />
    </>
  )
}

export default CategorySelector