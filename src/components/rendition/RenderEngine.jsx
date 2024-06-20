import React from "react";

const voidElements = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);

function parseRenderEntity(renderObject, index) {
  if (!renderObject) return null;

  const { tag, attributes, children, content } = renderObject;

  const style = attributes?.style || {};
  const className = attributes?.class || '';
  const src = attributes?.src || '';
  const href = attributes?.href || '';

  const Tag = tag;

  // Handle void elements separately
  if (voidElements.has(tag)) {
    return <Tag key={index} style={style} className={className} src={src} href={href} />;
  }

  return (
    <Tag key={index} style={style} className={className} src={src} href={href}>
      {content || children?.map((child, childIndex) => parseRenderEntity(child, `${index}-${childIndex}`))}
    </Tag>
  );
}

export default function RenderEngine({ renderObject }) {
  return (
    <>
      {parseRenderEntity(renderObject, 0)}
    </>
  );
}