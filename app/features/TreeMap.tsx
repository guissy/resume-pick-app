import React from 'react';
import * as d3 from 'd3';
import { HierarchyRectangularNode } from 'd3';
import capitalize from 'lodash/capitalize';
import { Keyword, ScoreFile } from './type';

type Props = {
  scoreFile: ScoreFile;
  index: number;
};
const width = 360;
const height = 120;

const TreeMap: React.FC<Props> = ({ scoreFile, index }) => {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (ref.current) {
      setTimeout(() => {
        const totalGained = scoreFile.keywords
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
          children: scoreFile.keywords
            .filter((k) => !!k.children.length)
            .map((k) => ({
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
            return `#0000ff${alpha}`;
          });

        cell
          .append('text')
          .attr('x', (d) => d.x0)
          .attr('y', (d) => d.y0)
          .attr('fill', (d) => {
            const r = Math.min(((d.x1 - d.x0) * (d.y1 - d.y0)) / 1200, 1);
            const alpha = Math.round(r * 255).toString(16);
            return `#ffffff${alpha}`;
          })
          .attr('font-size', (d) => {
            // eslint-disable-next-line no-control-regex
            const isZh = d.data.name.match(/[^\x00-\xff]/);
            const len = Math.max(d.data.name.length, 3.5);
            const w0 = d.x1 - d.x0;
            const w = (w0 / len) * 1.4;
            const h = d.y1 - d.y0;
            return Math.min(isZh ? w * 0.6 : w, h * 1.1);
          })
          .attr('dx', 5)
          .attr('dy', (d) => {
            // eslint-disable-next-line no-control-regex
            const isZh = d.data.name.match(/[^\x00-\xff]/);
            const len = Math.max(d.data.name.length, 3.5);
            const w0 = d.x1 - d.x0;
            const w = (w0 / len) * 1.4 * 0.1;
            const h = d.y1 - d.y0;
            const y = (h - w) / 2 + (isZh ? 20 : 10);
            return `${y}px`;
          })
          .text((d) => {
            const { name } = d.data;
            return name.length > 3 ? capitalize(name) : name;
          });
      }, (index + 1) * 100);
    }
  }, [ref, scoreFile?.keywords, index]);
  return (
    <div>
      <svg ref={ref} width={width} height={height} />
    </div>
  );
};

export default TreeMap;