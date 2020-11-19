import React from 'react';
import * as d3 from 'd3';
import { HierarchyRectangularNode } from 'd3';
import capitalize from 'lodash/capitalize';
import { Keyword, ScoreFile } from '../type';

type Props = {
  scoreFile: ScoreFile;
  search: string;
};
const width = 360;
const height = 120;

const TreeMap: React.FC<Props> = ({ scoreFile, search }) => {
  const ref = React.useRef(null);
  const key = React.useMemo(() => {
    if (scoreFile?.keywords?.length > 0) {
      return (Date.now() / 5000).toFixed(0);
    }
    return '';
  }, [scoreFile?.keywords]);
  React.useEffect(() => {
    if (ref.current) {
      const searchs = (search || '').trim().split(' ');
      const keywords = scoreFile?.keywords
        .filter((k) => !!k.children.length)
        .map((k) => ({
          ...k,
          children: k.children.filter(
            (w) => k.name === 'search' || !searchs.includes(w.name)
          ),
        }));
      const totalGained = keywords
        .map((v) => v.gained)
        .reduce((s, v) => s + v, 0);
      const widthOk = Math.max(Math.min((width * totalGained) / 20, 360), 80);
      const svg = d3.select(ref.current);
      const treeMap = d3
        .treemap()
        .tile(d3.treemapSquarify)
        .size([widthOk, height])
        .round(true)
        .paddingInner(1);
      const data = {
        name: '',
        children: keywords.map((k) => ({
          name: k.name,
          children: k.children
            .filter((w) => w.gained > 0)
            .map((w) => ({
              name: w.name,
              gained: w.gained,
            })),
        })),
        gained: NaN,
      };
      const hi = d3
        .hierarchy(data)
        .sum((d) => d.gained)
        .sort(
          (a, b) => (b.value || 0) - (a.value || 0)
        ) as HierarchyRectangularNode<Keyword>;

      treeMap(hi);

      const cell = svg.selectAll('g').data(hi.leaves()).enter().append('g');

      cell
        .append('rect')
        .attr('x', (d) => d.x0)
        .attr('y', (d) => d.y0)
        .attr('width', (d) => d.x1 - d.x0)
        .attr('height', (d) => d.y1 - d.y0)
        .attr('fill', (d) => {
          const r = Math.min(d.data.gained + 0.5 / 4.5, 0.9);
          const alpha = Math.round(r * 255).toString(16);
          if (
            search.toLowerCase().split(' ').includes(d.data.name.toLowerCase())
          ) {
            return `#ff0000${alpha}`;
          }
          return `#0000ff${alpha}`;
        });

      cell
        .append('text')
        .attr('x', (d) => d.x0)
        .attr('y', (d) => d.y0)
        .attr('fill', (d) => {
          const r = Math.min(((d.x1 - d.x0) * (d.y1 - d.y0)) / 1200, 1);
          const alpha = Math.round(r * 255).toString(16);
          return `#dddddd${alpha}`;
        })
        .attr('font-size', (d) => {
          // eslint-disable-next-line no-control-regex
          const isZh = d.data.name.match(/[^\x00-\xff]/);
          const len = Math.max(d.data.name.length, 2.5);
          const w0 = d.x1 - d.x0;
          const w = (w0 / len) * 1.45;
          const h = d.y1 - d.y0;
          return Math.min(Math.min(isZh ? w * 0.6 : w, h), 36).toFixed(1);
        })
        .attr('dx', function getDx(d) {
          // eslint-disable-next-line react/no-this-in-sfc
          const fontSize = parseFloat(this.getAttribute('font-size') || '12');
          const w0 = d.x1 - d.x0;
          // eslint-disable-next-line no-control-regex
          const isZh = d.data.name.match(/[^\x00-\xff]/);
          return (
            ((w0 - fontSize * 0.72 * d.data.name.length ** 0.88) / 2) *
            (isZh ? 0.5 : 1)
          );
        })
        .attr('dy', function getDy(d) {
          const h = d.y1 - d.y0;
          // eslint-disable-next-line react/no-this-in-sfc
          const fontSize = parseFloat(this.getAttribute('font-size') || '12');
          const y = h - Math.max((h - fontSize) / 2, 0) - fontSize / 10;
          return y.toFixed(1);
        })
        .text((d) => {
          const { name } = d.data;
          return name.length > 3 ? capitalize(name) : name.toUpperCase();
        });
    }
  }, [ref, scoreFile?.keywords, search]);
  return (
    <div>
      <svg key={key} ref={ref} width={width} height={height} />
    </div>
  );
};

export default TreeMap;
