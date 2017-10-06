'use strict';

// handle search and display statistics

exports.index = (req, res) => {
  res.render('index', {title: "Homepage"});
}
