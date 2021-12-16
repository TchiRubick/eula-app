import React from 'react';

import './Table.scss';

const Table = (props) => {
  const {
    data, headers, row, keyIndex,
  } = props;

  const renderHeader = () => headers.map((h) => (<th key={h}>{h}</th>));

  const renderContent = () => data.map((d) => <tr key={d[keyIndex]}>{renderRow(d)}</tr>);

  const renderRow = (d) => row.map((r) => <td key={r.key}>{r.render(d)}</td>);

  return (
    <div className="table-comp">
      <table className="table-comp__table">
        <thead className="__table-header">
          <tr>{renderHeader()}</tr>
        </thead>
        <tbody className="__table-content">{renderContent()}</tbody>
      </table>
    </div>
  );
};

export default Table;
