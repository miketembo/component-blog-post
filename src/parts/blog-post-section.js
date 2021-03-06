import React from 'react';

function BlogPostSection({ section }) {
  return (
    <h3
      className="blog-post__section"
      itemProp="articleSection"
    >{section}</h3>
  );
}

BlogPostSection.propTypes = {
  section: React.PropTypes.string.isRequired,
};

export default BlogPostSection;
