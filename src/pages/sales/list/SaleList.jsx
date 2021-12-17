import React, { useState, useEffect } from 'react';

import { KitContainer, KitPagination, KitTextField } from '@my2rela/react-kit';

import './SaleList.scss';

import Table from '../../../components/table/Table';

import { getSales } from '../../../api/sale.api';

const headers = ['Ticket', 'User', 'Payed', 'Backed', 'Created At'];

const getDateOfToday = () => {
  const local = new Date();
  return local.toJSON().slice(0, 10);
};

let delayer;

const SaleList = () => {
  const [salesList, setSalesList] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
  });
  const [dateFilter, setDateFilter] = useState(getDateOfToday);
  const [resume, setResume] = useState({});

  const fetchApiData = async () => {
    if (!dateFilter) {
      return;
    }

    const res = await getSales({ size: 30, page: pagination.page, date: dateFilter });

    if (res instanceof Error) {
      return;
    }

    setSalesList(res.sales);
    setPagination({ ...pagination, total: res.stats.totalPage, date: dateFilter });

    if (res.resume) {
      setResume(res.resume);
    }
  };

  useEffect(() => {
    clearTimeout(delayer);

    delayer = setTimeout(() => {
      fetchApiData();
    }, 500);
  }, [pagination.page, dateFilter]);

  const onPageChange = (p) => {
    setPagination({ ...pagination, page: p });
  };

  const renderRow = () => [
    {
      key: 'ticket',
      render: (d) => <div>{d.ticket}</div>,
    },
    {
      key: 'user',
      render: (d) => <div>{d.user.name}</div>,
    },
    {
      key: 'payed',
      render: (d) => <div>{d.payed}</div>,
    },
    {
      key: 'backed',
      render: (d) => <div>{d.backed}</div>,
    },
    {
      key: 'createdAt',
      render: (d) => <div>{d.createdAt}</div>,
    },
  ];

  const handleDateChange = ({ target }) => {
    setDateFilter(target.value);
  };

  return (
    <div className="sale-list">
      <KitContainer>
        <h1>{`Total: ${dateFilter}: ${resume.total || 0}`}</h1>
        <div className="sale-list__filter-date">
          <KitTextField type="date" onChange={handleDateChange} value={dateFilter} />
        </div>
        <Table data={salesList} keyIndex="ticket" row={renderRow()} headers={headers} />
        <KitPagination total={pagination.total} actual={pagination.page} onChange={onPageChange} />
      </KitContainer>
    </div>
  );
};

export default SaleList;
