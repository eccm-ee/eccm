// table.mjs: the .table component of public/eccm.css as markup, written once
// (asked 2026-10-01: "Use table component where y can"). cols are
// { label, cls } with cls '', 'num' or 'main' (the one column that takes the
// width and wraps); rows are arrays of cells, each a string or html, and a row
// may be { cells, current } to mark the one that is now. Every cell carries
// its column's label as data-label, which the narrow form prints before it.
import { html } from './html.mjs';

export const table = ({ cols, rows, label }) => html`<div class="table"><table${label ? html` aria-label="${label}"` : ''}>
      <thead><tr>${cols.map((c) => html`<th scope="col"${c.cls ? html` class="${c.cls}"` : ''}>${c.label}</th>`)}</tr></thead>
      <tbody>${rows.map((r) => {
        const cells = Array.isArray(r) ? r : r.cells;
        return html`<tr${!Array.isArray(r) && r.current ? html` aria-current="true"` : ''}>${cells.map((cell, i) => html`<td${cols[i].cls ? html` class="${cols[i].cls}"` : ''} data-label="${cols[i].label}">${cell}</td>`)}</tr>`;
      })}</tbody>
    </table></div>`;
