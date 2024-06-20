import React from "react";

export default function RenderEngine({ renderObject }) {

  const parseRenderEntity = (renderObject) => {
    if (!renderObject) return null;

    const { tag, attributes, children, content } = renderObject;

    const style = attributes?.style || {};
    const className = attributes?.class || '';
    const src = attributes?.src || '';
    const href = attributes?.href || '';

    const Tag = tag;

    return (
      <Tag style={style} className={className} src={src} href={href}>
        {content || children?.map((child, index) => parseRenderEntity(child))}
      </Tag>
    );
  }

  return (
    <>
      {parseRenderEntity(renderObject)}
    </>
  );
}