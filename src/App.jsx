import React, { useState } from 'react';
import './App.scss';
import cn from 'classnames';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const categories = categoriesFromServer.map((category) => {
  const owner = usersFromServer.find(user => user.id === category.ownerId);
  const products = productsFromServer.filter(
    product => product.categoryId === category.id,
  );

  return {
    ...category,
    owner,
    products: products.map(product => ({
      id: product.id,
      name: product.name,
    })),
  };
});

function isMale(user) {
  return user.sex === 'm';
}

function getCategoriesForRender(categorys, selectedPerson, searchQuery) {
  if (!selectedPerson && !searchQuery) {
    return categorys;
  }

  const filtered = [...categorys].filter(
    category => category.owner.name === selectedPerson,
  );

  if (searchQuery) {
    return filtered.filter(category => category.products.some(
      product => product.name.toLowerCase().includes(searchQuery.toLowerCase()),
    ));
  }

  return filtered;
}

const MAX = 'Max';
const ANNA = 'Anna';
const ROMA = 'Roma';

export const App = () => {
  const [selectedPerson, setSelectedPerson] = useState('');
  const [searchQuery, setSearchQueary] = useState('');

  const renderList = getCategoriesForRender(
    categories, selectedPerson, searchQuery,
  );

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                onClick={() => setSelectedPerson('')}
                className={cn({ 'is-active': !selectedPerson })}
              >
                All
              </a>

              <a
                data-cy="FilterUser"
                href="#/"
                className={cn({ 'is-active': selectedPerson === ANNA })}
                onClick={() => setSelectedPerson(ANNA)}
              >
                Anna
              </a>

              <a
                data-cy="FilterUser"
                href="#/"
                className={cn({ 'is-active': selectedPerson === MAX })}
                onClick={() => setSelectedPerson(MAX)}
              >
                Max
              </a>

              <a
                data-cy="FilterUser"
                href="#/"
                onClick={() => setSelectedPerson(ROMA)}
                className={cn({ 'is-active': selectedPerson === ROMA })}
              >
                Roma
              </a>
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={event => setSearchQueary(event.target.value)}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {searchQuery && (
                  <span className="icon is-right">
                    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                    />
                  </span>
                )}
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className="button is-success mr-6 is-outlined"
              >
                All
              </a>

              <a
                data-cy="Category"
                className="button mr-2 my-1 is-info"
                href="#/"
              >
                Category 1
              </a>

              <a
                data-cy="Category"
                className="button mr-2 my-1"
                href="#/"
              >
                Category 2
              </a>

              <a
                data-cy="Category"
                className="button mr-2 my-1 is-info"
                href="#/"
              >
                Category 3
              </a>
              <a
                data-cy="Category"
                className="button mr-2 my-1"
                href="#/"
              >
                Category 4
              </a>
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          <p data-cy="NoMatchingMessage">
            No products matching selected criteria
          </p>

          <table
            data-cy="ProductTable"
            className="table is-striped is-narrow is-fullwidth"
          >
            <thead>
              <tr>
                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    ID

                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    Product

                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort-down" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    Category

                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort-up" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    User

                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort" />
                      </span>
                    </a>
                  </span>
                </th>
              </tr>
            </thead>

            <tbody>
              {renderList.map(category => (
                category.products.map(product => (
                  <tr data-cy="Product" key={product.id}>
                    <td className="has-text-weight-bold" data-cy="ProductId">
                      {product.id}
                    </td>

                    <td data-cy="ProductName">{product.name}</td>
                    <td data-cy="ProductCategory">
                      {category.icon}
                      -
                      {category.title}
                    </td>

                    <td
                      data-cy="ProductUser"
                      className={cn({
                        'has-text-link': isMale(category.owner),
                        'has-text-danger': !isMale(category.owner),
                      })}
                    >
                      {category.owner.name}
                    </td>
                  </tr>
                ))
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
