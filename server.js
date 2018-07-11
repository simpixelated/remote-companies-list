const request = require('request');
const express = require('express');
const Linkedin = require('node-linkedin')('86r2qfy66jna19', 'r88UqnHdyu3qyWsg', 'http://localhost:4000/oauth/linkedin/callback');
let linkedin;

const scope = ['r_basicprofile'];
const app = express();
const port = 4000;

app.get('/oauth/linkedin', function (req, res) {
  // This will ask for permisssions etc and redirect to callback url.
  Linkedin.auth.authorize(res, scope);
});

app.get('/oauth/linkedin/callback', function (req, res) {
  // console.log(res);
  Linkedin.auth.getAccessToken(res, req.query.code, req.query.state, function (err, results) {
    if (err)
      return console.error(err);

    /**
     * Results have something like:
     * {"expires_in":5184000,"access_token":". . . ."}
     */

    console.log(results);

    linkedin = Linkedin.init(results.access_token);
    return res.redirect('/me');
  });
});

app.get('/linkedin/me', function (req, res) {
  // Loads the profile of access token owner.
  linkedin.people.me(function (err, $in) {
    if (err) {
      return console.error(err);
    }
    return res.json($in);
  });
});

app.get('/companies', function (req, res) {
  const options = {
    method: 'GET',
    url: 'https://api.crunchbase.com/v3.1/odm-organizations',
    qs: {
      query: req.query && req.query.name,
      user_key: 'ff642e2ae9a6d707b557dda48eb09ff6'
    }
  };
  request(options, function (error, response, body) {
    if (error) throw new Error(error);

    console.log(body);
    res.send(body);
  });
  // linkedin.companies_search.name('LinkedIn,Facebook', 10, function (err, companies) {
  //   if (err) {
  //     return console.error(err);
  //   }
  //   return res.json(companies);
  // });
});

app.get('/linkedin/companies2', function (req, res) {
  linkedin.companies.name('Xapo', function (err, companies) {
    if (err) {
      return console.error(err);
    }
    return res.json(companies);
  });
});

app.listen(port, () => console.log(`LinkedIn API is listening on port :${port}`));