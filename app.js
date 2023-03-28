const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const fs = require('fs');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var mocks_get_map = {
  "/v1/xpress/pan-form": {
    mock: "mocks/get-pan-form-success.json",
    status_code: 200,
    latency: 2000
  },
  "/v1/xpress/check-eligibility-1": {
    mock: "mocks/check-eligibility-1.json",
    status_code: 200,
    latency: 50
  },
  "/v1/xpress/check-eligibility-2": {
    mock: "mocks/check-eligibility-2.json",
    status_code: 200,
    latency: 50
  },
  "/v1/xpress/check-eligibility-3": {
    mock: "mocks/check-eligibility-3.json",
    status_code: 200,
    latency: 50
  },
  "/v1/xpress/check-eligibility-4": {
    mock: "mocks/check-eligibility-4-success.json",
    status_code: 200,
    latency: 50
  },
  "/v1/xpress/express-eligible": {
    mock: "mocks/express-eligible-success.json",
    status_code: 200,
    latency: 500
  },
  "/v1/xpress/express-ineligible": {
    mock: "mocks/express-eligible-declined.json",
    status_code: 200,
    latency: 500
  },
  "/v1/xpress/bank-verification": {
    mock: "mocks/bank-verification-success-few-banks.json",
    status_code: 200,
    latency: 500
  },
  "/v1/xpress/bank-addition": {
    mock: "mocks/bank-addition-success.json",
    status_code: 200,
    latency: 500
  },
  "/v1/xpress/get-bank-list": {
    mock: "mocks/get-bank-list-success.json",
    status_code: 200,
    latency: 500
  },
  "/v1/xpress/loan-review": {
    mock: "mocks/get-loan-review-success.json",
    status_code: 200,
    latency: 2000
  },
  "/v1/xpress/blocked": {
    mock: "mocks/xpress-blocked.json",
    status_code: 200,
    latency: 2000
  }, "/v1/xpress/agreement": {
    mock: "mocks/get-agreement-success.json",
    status_code: 200,
    latency: 2000
  }, "/v0/ios/user/token": {
    mock: "mocks/token-refresh-success.json",
    status_code: 200,
    latency: 2000
  }, "/v1/xpress/verify-income": {
    mock: "mocks/employment-details-success.json",
    status_code: 200,
    latency: 2000
  }, "/v1/xpress-cash/employer-name": {
    mock: "mocks/employer-list-success.json",
    status_code: 200,
    latency: 2000
  }, "/v1/xpress-cash/get-sub-industry-type": {
    mock: "mocks/sub-industry-list-success.json",
    status_code: 200,
    latency: 2000
  }
}

var mocks_post_map = {
  "/v1/xpress/pan-form": {
    mock: "mocks/submit-pan-form-success.json",
    status_code: 200,
    latency: 2000
  },
  "/v1/xpress/confirm-bank": {
    mock: "mocks/confirm-bank-success.json",
    status_code: 400,
    latency: 2000
  },
  "/v1/xpress/loan-review": {
    mock: "mocks/confirm-loan-review-success.json",
    status_code: 200,
    latency: 2000
  }, "/v1/xpress-cash/confirm-employment-details": {
    mock: "mocks/confirm-employment-details-success.json",
    status_code: 200,
    latency: 2000
  }
}

app.get('/api/set-response', (req, res, next) => {
  const path = req.query['path'];
  const mock = req.query['mock'];
  const status_code = req.query['code'];
  const latency = req.query['latency'];
  const method = req.query['method'];

  if (method == "GET") {
    if (mocks_get_map[path] === undefined || mocks_get_map[path] === null) {
      res.status(404).json({
        "message": "Path not found"
      });
    }
  } else if (method == "POST") {
    if (mocks_post_map[path] === undefined || mocks_post_map[path] === null) {
      res.status(404).json({
        "message": "Path not found"
      });
    }
  }

  if (method == 'GET') {
    if (mock != undefined && mock != null) {
      mocks_get_map[path].mock = mock;
    }

    if (status_code != undefined && status_code != null) {
      mocks_get_map[path].status_code = status_code;
    }

    if (latency != undefined && latency != null) {
      mocks_get_map[path].latency = latency;
    }

    res.status(200).json({
      "message": "Response set successfully"
    });
  } else if (method == 'POST') {
    if (mock != undefined && mock != null) {
      mocks_post_map[path].mock = mock;
    }

    if (status_code != undefined && status_code != null) {
      mocks_post_map[path].status_code = status_code;
    }

    if (latency != undefined && latency != null) {
      mocks_post_map[path].latency = latency;
    }

    res.status(200).json({
      "message": "Response set successfully"
    });
  }
})

// Catch all handler for all requests
app.use(function (req, res, next) {
  if (
    (
      req.path == "/v1/xpress/pan-form" ||
      req.path == "/v1/xpress/check-eligibility-1" ||
      req.path == "/v1/xpress/check-eligibility-2" ||
      req.path == "/v1/xpress/check-eligibility-3" ||
      req.path == "/v1/xpress/check-eligibility-4" ||
      req.path == "/v1/xpress/express-eligible" ||
      req.path == "/v1/xpress/express-ineligible" ||
      req.path == "/v1/xpress/bank-verification" ||
      req.path == "/v1/xpress/bank-addition" ||
      req.path == "/v1/xpress/get-bank-list" ||
      req.path == "/v1/xpress/loan-review" ||
      req.path == "/v1/xpress/blocked" ||
      req.path == "/v1/xpress/agreement" ||
      req.path == "/v0/ios/user/token" ||
      req.path == "/v1/xpress/verify-income" ||
      req.path == "/v1/xpress-cash/employer-name" ||
      req.path == "/v1/xpress-cash/get-sub-industry-type"
    ) &&
    req.method == 'GET'
  ) {
    setTimeout((arg) => {
      res.status(
        mocks_get_map[req.path].status_code
      ).json(
        JSON.parse(
          read_file(mocks_get_map[req.path].mock
          )
        )
      );
    }, mocks_get_map[req.path].latency);
  } else if (
    (
      req.path == "/v1/xpress/pan-form" ||
      req.path == "/v1/xpress/confirm-bank" || 
      req.path == "/v1/xpress/loan-review" ||
      req.path == "/v1/xpress-cash/confirm-employment-details"
    ) && 
    req.method == 'POST'
  ) {
    setTimeout((arg) => {
      res.status(
        mocks_post_map[req.path].status_code
      ).json(
        JSON.parse(
          read_file(mocks_post_map[req.path].mock
          )
        )
      );
    }, mocks_post_map[req.path].latency);
  }
});

function read_file(file_path) {
  return fs.readFileSync(file_path, 'utf8');
}

module.exports = app;
