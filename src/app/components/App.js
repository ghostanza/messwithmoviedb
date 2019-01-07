import React from 'react';
import MDB from 'moviedb';

export default class App extends React.Component {
  render() {
    MDB.getMovieByID(400).then((res) => {console.log(res)});
    return (
      <div>
        <h1>{MDB.config.images.base_url}</h1>
        <h2>test</h2>
      </div>
    );
  }
}
