import Author from './parts/author';
import BlogPostImage from './parts/blog-post-image';
import BlogPostSection from './parts/blog-post-section';
import FlyTitle from './parts/fly-title';
import ImageCaption from './parts/image-caption';
import React from 'react';
import Rubric from './parts/rubric';
import ShareBar from './parts/blog-post-sharebar';
import Text from './parts/text';
import Title from './parts/title';

import classnames from 'classnames';
import urlJoin from 'url-join';

export default class BlogPost extends React.Component {
  static get propTypes() {
    return {
      className: React.PropTypes.string,
      image: React.PropTypes.shape({
        src: React.PropTypes.string,
        caption: React.PropTypes.string,
        alt: React.PropTypes.string,
      }),
      author: React.PropTypes.string,
      byline: React.PropTypes.string,
      shareBar: React.PropTypes.bool,
      section: React.PropTypes.string,
      sectionUrl: React.PropTypes.string,
      flyTitle: React.PropTypes.string,
      title: React.PropTypes.string.isRequired,
      rubric: React.PropTypes.string,
      dateTime: React.PropTypes.instanceOf(Date),
      dateString: React.PropTypes.string,
      timestampISO: React.PropTypes.string,
      dateFormat: React.PropTypes.func,
      text: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.node,
      ]).isRequired,
      afterText: React.PropTypes.node,
      itemType: React.PropTypes.string,
      itemProp: React.PropTypes.string,
    };
  }
  static get defaultProps() {
    return {
      itemType: 'http://schema.org/BlogPosting',
      itemProp: 'blogPost',
      dateFormat: (date) => {
        const tenMinutes = 10;
        // Sep 19th 2015, 9:49
        function addPostFix(day) {
          const daystr = day.toString();
          const lastChar = daystr.charAt(daystr.length - 1);
          let postFix = '';
          switch (lastChar) {
            case '1':
              postFix = 'st';
              break;
            case '2':
              postFix = 'nd';
              break;
            case '3':
              postFix = 'rd';
              break;
            default:
              postFix = 'th';
              break;
          }
          return `${ day }${ postFix }`;
        }
        const shortMonthList = [
          'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
        ];
        let minutes = date.getMinutes() < tenMinutes ? '0' : '';
        minutes += date.getMinutes();
        return [ `${ shortMonthList[date.getMonth()] }`,
                 `${ addPostFix(date.getDate()) }`,
                 `${ date.getFullYear() },`,
                 `${ date.getHours() }:${ minutes }` ].join(' ');
      },
    };
  }

  addDateTime(sectionDateAuthor, props) {
    const { dateTime, dateFormat, dateString, timestampISO } = props;
    let result = sectionDateAuthor.slice();
    if (dateTime) {
      result = result.concat((
        <time
          className="blog-post__datetime"
          itemProp="dateCreated"
          dateTime={this.props.dateTime}
          key="blog-post__datetime"
        >{dateFormat(dateTime)}</time>));
    }
    if (dateString && timestampISO) {
      result = result.concat((
        <time
          className="blog-post__datetime"
          itemProp="dateCreated"
          dateTime={timestampISO}
          key="blog-post__datetimeISO"
        >{dateString}</time>));
    }
    return result;
  }

  addImage(content, image = {}) {
    const { src, caption, alt } = image;
    if (src) {
      const imageCaption = caption ? <ImageCaption caption={caption} key="blog-post__image-caption" /> : null;
      return content.concat(
        <BlogPostImage
          key="blogimg"
          caption={imageCaption}
          src={src}
          alt={alt}
        />
      );
    }
    return content;
  }

  addRubric(content, rubric) {
    if (rubric) {
      return content.concat(<Rubric rubric={rubric} key="blog-post__rubric" />);
    }
    return content;
  }

  addBlogPostSection(sectionDateAuthor, section, sectionUrl) {
    if (section) {
      if (sectionUrl && !/^(\w+:)?\/\//.test(sectionUrl)) {
        sectionUrl = urlJoin('/', sectionUrl);
      }
      const blogPostSection = sectionUrl ? (
        <a href={sectionUrl} className="blog-post__section-link">
          {section}
        </a>
      ) : section;
      return sectionDateAuthor.concat(
        <BlogPostSection key="blog-post__section" section={blogPostSection} />
      );
    }
    return sectionDateAuthor;
  }

  addByLine(sectionDateAuthor, byline) {
    if (byline) {
      return sectionDateAuthor.concat(
        <p className="blog-post__byline-container" key="blog-post__byline-container">
          {"by "}
          <span
            className="blog-post__byline"
            itemProp="author"
          >{byline}</span>
        </p>
      );
    }
    return sectionDateAuthor;
  }

  render() {
    let content = [];
    const asideableContent = [];
    let sectionDateAuthor = [];
    content = this.addRubric(content, this.props.rubric);
    content = this.addImage(content, this.props.image);
    sectionDateAuthor = this.addBlogPostSection(sectionDateAuthor, this.props.section, this.props.sectionUrl);
    sectionDateAuthor = this.addDateTime(sectionDateAuthor, this.props);
    sectionDateAuthor = this.addByLine(sectionDateAuthor, this.props.byline);
    if (sectionDateAuthor.length) {
      asideableContent.push(
        <div
          className="blog-post__section-date-author"
          key="blog-post__section-date-author"
        >
          {sectionDateAuthor}
        </div>
      );
    }
    if (this.props.shareBar) {
      asideableContent.push(<ShareBar key="sharebar" />);
    }
    if (asideableContent.length) {
      content.push((
        <div
          className="blog-post__asideable-content blog-post__asideable-content--meta"
          key="asideable-content"
        >
          {asideableContent}
        </div>
      ));
    }
    if (this.props.author) {
      content.push(<Author key="blog-post__author" author={this.props.author} />);
    }

    return (
      <article
        itemScope
        className={classnames('blog-post', this.props.className)}
        itemProp={this.props.itemProp}
        itemType={this.props.itemType}
        role="article"
      >
        <FlyTitle title={this.props.flyTitle} key="blog-post__flytitle" />
        <Title title={this.props.title} key="blog-post__title" />
        {content}
        <Text text={this.props.text} key="blog-post__text" />
        {this.props.afterText}
      </article>
    );
  }
}
