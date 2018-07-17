import React from 'react';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter, selectFilter } from 'react-bootstrap-table2-filter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faSmile, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import _ from 'lodash';
import companies from './companies.json';

// creates a keyed object to use with react-bootstrap-table-next selectFilter
const getSelectOptions = (collection, dataField) => {
  return _.flow([
    (property) => _.map(collection, property),
    _.uniq,
    _.sortBy,
    (values) => _.reduce(values, (result, value, key) => {
      result[value] = value;
      return result;
    }, {}),
  ])(dataField);
};
const countryOptions = getSelectOptions(companies, 'hqCountry');

const TwitterCell = ({ handle, avatar }) => (
  <MediaCell
    href={`https://twitter.com/${handle}`}
    avatar={avatar}
    children={
      <div>
        <strong>{handle}</strong>
        <p className="small"><FontAwesomeIcon icon={faTwitter} size="1x" /> [x] followers</p>
      </div>
    }
  />
);

const MediaCell = ({ href, avatar, children }) => (
  <a className="media" href={href} target="_blank">
    {avatar && <img src={avatar} className="mr-3" />}
    {!avatar && <FontAwesomeIcon icon={faSmile} className="mr-3" size="2x" />}
    <span className="media-body">
      {children}
    </span>
  </a>
);

const CompaniesList = () => {
  const baseColumn = {
    headerClasses: 'align-top',
  };
  const columns = [{
    text: "Company",
    dataField: "name",
    filter: textFilter(),
    formatter: (cell, row) => (
      <div>
        <MediaCell
          href={row.url}
          children={
            <div>
              <strong>{cell}</strong>
              <p className="small">{row.description}</p>
            </div>
          }
        />
        {row.twitter && row.twitter !== 'N/A' && <a className="card-link small" target="_blank" href={`https://twitter.com/${row.twitter}`}><FontAwesomeIcon icon={faTwitter} size="1x" /> ? followers</a>}
        {row.urlJobs && <a href={row.urlJobs} className="card-link small" target="_blank">Jobs</a>}
      </div>
    )
  }, {
    text: "Employees",
    dataField: "employees",
    sort: true,
  }, {
    text: "HQ (city)",
    dataField: "hqCity",
    filter: textFilter(),
  }, {
    text: "HQ (country)",
    dataField: "hqCountry",
    // filter: textFilter(),
    formatter: cell => countryOptions[cell],
    filter: selectFilter({
      options: countryOptions
    })
  }, {
    text: "CEO",
    dataField: "ceoTwitter",
    formatter: (cell, row) => {
      if (cell) {
        return <TwitterCell handle={cell} />
      }
      return <span>{row.ceoName}</span>
    }
  }].map(column => ({ ...baseColumn, ...column }));

  return (
    <BootstrapTable
      keyField="name"  
      data={companies}
      columns={columns}
      headerClasses="align-top"
      filter={filterFactory()}
      bordered={false}
      hover
    />
  );
}

export default CompaniesList;
