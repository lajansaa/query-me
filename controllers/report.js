// downloading of output results
const json2xls = require('json2xls');
const fs = require('fs');

const getReport = (db) => {
  return (request, response) => {
    db.reportDB.get(request.params.id, (error, queryResults) => {
      db.reportDB.getOutput(queryResults.query, (error2, queryResults2) => {
        if (error2) {
          response.render('report/report', { metadata: queryResults,
                                             error: true, 
                                             errorMessage : error2 })
        } else {
          response.render('report/report', { metadata: queryResults, 
                                             data: queryResults2.rows })
        }
      })
    })
  }
}

const editReport = (db) => {
  return (request, response) => {
    db.reportDB.get(request.params.id, (error, queryResults) => {
      response.render('report/edit', queryResults);
    })
  }
}

const edit = (db) => {
  return (request, response) => {
    db.reportDB.edit(request.body, (error, queryResults) => {
      response.send('done');
    })
  }
}

const newReport = (db) => {
  return (request, response) => {
    db.reportDB.getCategory((error, queryResults) => {
      response.render('report/new', { category: queryResults });
    });
  }
}

const createReport = (db) => {
  return (request, response) => {
    db.reportDB.createReport(request.body, (error, queryResults) => {
      response.send(queryResults);
    });
  }
}

const remove = (db) => {
  return (request, response) => {
    db.reportDB.remove(request.params.id, (error, queryResults) => {
      response.send(queryResults);
    });
  }
}

const downloadReport = (db) => {
  return (request, response) => {
    db.reportDB.get(request.params.id, (error, queryResults) => {
      db.reportDB.getOutput(queryResults.query, (error2, queryResults2) => {
        if (error2) {
          response.render('report/report', { metadata: queryResults,
                                             error: true, 
                                             errorMessage : error2 })
        } else {
          const xls = json2xls(queryResults2.rows);
          const fileName = queryResults.title.replace(/\s/g, '-') + '.xlsx';
          fs.writeFileSync('./public/exports/' + fileName, xls, 'binary');
          response.download('./public/exports/' + fileName, fileName, (err) => {
            if (err) {
              console.error(err);
            } else {
              fs.unlinkSync('./public/exports/' + fileName);
            }
          });
        }
      })
    })
  }
}

module.exports = {
  getReport,
  editReport,
  edit,
  newReport,
  createReport,
  remove,
  downloadReport
}