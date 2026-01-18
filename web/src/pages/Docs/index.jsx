import React, { useEffect, useState, useMemo } from 'react';
import { marked } from 'marked';
import { Empty, Layout, Card, Typography, Spin, Anchor } from '@douyinfe/semi-ui';
import {
  IllustrationConstruction,
  IllustrationConstructionDark,
} from '@douyinfe/semi-illustrations';
import { useTranslation } from 'react-i18next';
import { DEFAULT_DOCS_CONTENT } from './content';
import MarkdownRenderer from '../../components/common/markdown/MarkdownRenderer';

const { Sider, Content } = Layout;
const { Title } = Typography;

const Docs = () => {
  const { t } = useTranslation();
  const [docs, setDocs] = useState('');
  const [rawDocs, setRawDocs] = useState('');
  const [docsLoaded, setDocsLoaded] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  // Add IDs to rendered headings after mount
  useEffect(() => {
    if (!docsLoaded || !rawDocs) return;

    const addHeadingIds = () => {
      const headingElements = document.querySelectorAll('h1, h2, h3');
      headingElements.forEach((heading) => {
        if (!heading.id) {
          const text = heading.textContent || '';
          const id = text.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-').replace(/^-|-$/g, '');
          heading.id = id;
        }
      });
    };

    // Wait a bit for markdown to render
    const timer = setTimeout(addHeadingIds, 100);
    return () => clearTimeout(timer);
  }, [docsLoaded, rawDocs]);

  // Extract headings from markdown content for sidebar navigation
  const sidebarItems = useMemo(() => {
    if (!rawDocs) return [];
    
    const headingRegex = /^(#{1,3})\s+(.+)$/gm;
    const items = [];
    let match;

    while ((match = headingRegex.exec(rawDocs)) !== null) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = text.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-').replace(/^-|-$/g, '');
      
      items.push({ level, text, id });
    }

    return items;
  }, [rawDocs]);

  const displayDocs = () => {
    // Use local content directly from content.js
    setRawDocs(DEFAULT_DOCS_CONTENT);
    const defaultContent = marked.parse(DEFAULT_DOCS_CONTENT);
    setDocs(defaultContent);
    setDocsLoaded(true);
  };

  useEffect(() => {
    displayDocs();
  }, []);

  // Add IDs to rendered headings after mount
  useEffect(() => {
    if (!docsLoaded || !rawDocs) return;

    const addHeadingIds = () => {
      const headingElements = document.querySelectorAll('.markdown-body h1, .markdown-body h2, .markdown-body h3');
      headingElements.forEach((heading) => {
        if (!heading.id) {
          const text = heading.textContent || '';
          const id = text.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-').replace(/^-|-$/g, '');
          heading.id = id;
        }
      });
    };

    // Wait a bit for markdown to render
    const timer = setTimeout(addHeadingIds, 100);
    return () => clearTimeout(timer);
  }, [docsLoaded, rawDocs]);

  // Handle scroll to update active section
  useEffect(() => {
    if (!rawDocs || sidebarItems.length === 0) return;

    const handleScroll = () => {
      const headings = sidebarItems.map(item => document.getElementById(item.id)).filter(Boolean);
      const scrollPos = window.scrollY + 100;

      for (let i = headings.length - 1; i >= 0; i--) {
        if (headings[i].offsetTop <= scrollPos) {
          setActiveSection(headings[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, [rawDocs, sidebarItems]);

  const emptyStyle = {
    padding: '24px',
  };

  const customDescription = (
    <div style={{ textAlign: 'center' }}>
      <p>{t('可在设置页面设置文档内容，支持 HTML & Markdown')}</p>
    </div>
  );

  // If content is a URL (iframe)
  if (docs.startsWith('https://')) {
    return (
      <div className='mt-[60px] px-2'>
        <iframe
          src={docs}
          style={{ width: '100%', height: '100vh', border: 'none' }}
        />
      </div>
    );
  }

  return (
    <div className='mt-[60px]' style={{ position: 'relative' }}>
      {docsLoaded && docs === '' ? (
        <div className='flex justify-center items-center h-screen p-8'>
          <Empty
            image={
              <IllustrationConstruction style={{ width: 150, height: 150 }} />
            }
            darkModeImage={
              <IllustrationConstructionDark
                style={{ width: 150, height: 150 }}
              />
            }
            description={t('管理员暂时未设置任何文档内容')}
            style={emptyStyle}
          >
            {customDescription}
          </Empty>
        </div>
      ) : (
        <div style={{ display: 'flex', position: 'relative', minHeight: 'calc(100vh - 64px)' }}>
          {sidebarItems.length > 0 && (
            <aside
              style={{
                position: 'sticky',
                top: '64px',
                alignSelf: 'flex-start',
                height: 'calc(100vh - 64px)',
                overflowY: 'auto',
                overflowX: 'hidden',
                background: 'var(--semi-color-bg-0)',
                borderRight: '1px solid var(--semi-color-border)',
                padding: '24px 16px',
                width: '280px',
                flexShrink: 0,
                zIndex: 10,
              }}
            >
              <Title heading={5} style={{ marginBottom: '16px', fontSize: '14px' }}>
                {t('目录')}
              </Title>
              <nav style={{ paddingLeft: '0' }}>
                {sidebarItems.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      marginLeft: `${(item.level - 1) * 16}px`,
                      marginBottom: '8px',
                    }}
                  >
                    <a
                      href={`#${item.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        const element = document.getElementById(item.id);
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          setActiveSection(item.id);
                        }
                      }}
                      style={{
                        display: 'block',
                        padding: '4px 8px',
                        fontSize: item.level === 1 ? '14px' : item.level === 2 ? '13px' : '12px',
                        fontWeight: item.level === 1 ? '600' : item.level === 2 ? '500' : '400',
                        color:
                          activeSection === item.id
                            ? 'var(--semi-color-primary)'
                            : 'var(--semi-color-text-1)',
                        textDecoration: 'none',
                        borderRadius: '4px',
                        transition: 'all 0.2s',
                        backgroundColor:
                          activeSection === item.id
                            ? 'var(--semi-color-primary-light-active)'
                            : 'transparent',
                      }}
                      onMouseEnter={(e) => {
                        if (activeSection !== item.id) {
                          e.target.style.backgroundColor = 'var(--semi-color-fill-0)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (activeSection !== item.id) {
                          e.target.style.backgroundColor = 'transparent';
                        }
                      }}
                    >
                      {item.text}
                    </a>
                  </div>
                ))}
              </nav>
            </aside>
          )}
          <main
            style={{
              padding: '32px',
              maxWidth: '1200px',
              margin: '0 auto',
              width: '100%',
              flex: '1',
              minWidth: 0,
            }}
          >
            {!docsLoaded ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}>
                <Spin size='large' />
              </div>
            ) : (
              <Card
                style={{
                  padding: '48px',
                  boxShadow: 'none',
                  border: '1px solid var(--semi-color-border)',
                }}
              >
                <div
                  style={{
                    maxWidth: '900px',
                    margin: '0 auto',
                  }}
                >
                  {rawDocs ? (
                    <MarkdownRenderer
                      content={rawDocs}
                      style={{
                        fontSize: '15px',
                        lineHeight: '1.8',
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        fontSize: '15px',
                        lineHeight: '1.8',
                      }}
                      dangerouslySetInnerHTML={{ __html: docs }}
                    />
                  )}
                </div>
              </Card>
            )}
          </main>
        </div>
      )}
    </div>
  );
};

export default Docs;
