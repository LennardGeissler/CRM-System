// const express = require('express');
// const sql = require('mssql');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const app = express();

// app.use(express.json());

// const sqlConfig = {
//   user: "crm",
//   password: "123",
//   database: "CRM-System",
//   server: 'localhost',
//   database: 'CRM-System',
//   // port: 1443,
//   // pool: {
//   //   max: 10,
//   //   min: 0,
//   //   idleTimeoutMillis: 30000
//   // },
//   options: {
//     encrypt: false, // for azure
//     trustServerCertificate: true // change to true for local dev / self-signed certs
//   }
// }

// sql.connect(sqlConfig).then(() => {
//   console.log('Verbindung hergestellt')
// }).catch(err => {
//   console.log('Fehlgeschlagen', err);
// })

// // async function connectToDatabase() {
// //   try {
// //     await sql.connect(sqlConfig);
// //     console.log('Erfolgreich mit der Datenbank verbunden');
// //   } catch (err) {
// //     console.error('Fehler bei der Verbindung zur Datenbank:', err);
// //   }
// // }

// // async () => {
// //   try {
// //     // make sure that any items are correctly URL encoded in the connection string
// //     await sql.connect(sqlConfig)
// //     const result = await sql.query('SELECT * FROM Mitarbeiter;')
// //     console.dir(result)
// //   } catch (err) {
// //     // ... error checks
// //   }
// // }

// app.get('/', async (req, res) => {
//   try {
//     const result = await sql.query`SELECT * FROM Mitarbeiter`; // Ihre Abfrage hier einfügen
//     res.json(result.recordset);
//   } catch (err) {
//     console.error('Error retrieving data:', err);
//     res.status(500).json({ error: 'Error retrieving data' });
//   }
// });

// app.post('/', async (req, res) => {
//   const { name, password } = req.body;

//     const query = `SELECT * FROM accounts WHERE username = ${name} AND password = ${password}`;

//     sql.query(query, (err, result) => {
//         if (err) {
//             console.error('Error executing login query:', err);
//             return res.status(500).json({ success: false, message: 'Internal server error' });
//         } else {
//             if (result.length > 0) {
//                 return res.json({ success: true, message: 'Login successful' });
//             } else {
//                 return res.status(401).json({ success: false, message: 'Invalid credentials' });
//             }
//         }
//     });
// });

// const port = 3000;
// app.listen(port, () => {
//   console.log(`Server listen on port ${port}`);
//   // connectToDatabase();
// })

const sql = require('mssql/msnodesqlv8');
const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser');
const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

var config = {
  server: "DESKTOP-Q2G1TTS\\SQLEXPRESS",
  database: "CRM-System",
  driver: "msnodesqlv8",
  user: "crm",
  password: "123",
  options: {
    trustedConnection: true,
  }
}
const query = "SELECT * FROM dbo.Mitarbeiter";

sql.connect(config, (err) => {
  if (err) {
    console.log(err);
  }
  var request = new sql.Request();
  request.query("select * from Mitarbeiter", (err, records) => {
    if (err) {
      console.log(err);
    }
    else {
      console.log(records)
    }
  })
})

app.get("/", (req, res, next) => {
  var request = new sql.Request();
  request.query(query, (err, rows) => {
    if (err) {
      console.log(err);
    } else if (rows) {
      res.json(rows);
    } else {
      res.send("nothing here");
    }
  });

});

app.get("/deals", (req, res, next) => {
  const query = "SELECT * FROM dbo.Kunden";

  var request = new sql.Request();
  request.query(query, (err, rows) => {
    if (err) {
      console.log(err);
    } else if (rows) {
      res.json(rows);
    } else {
      res.send("nothing here");
    }
  });

});

app.post('/', (req, res) => {
  const { name, password } = req.body;
  const request = new sql.Request();
  request.input('name', sql.VarChar, name);
  request.input('password', sql.VarChar, password);

  const query = `SELECT * FROM dbo.Mitarbeiter WHERE Name = @name AND HashedPasswort = @password`;

  request.query(query, (err, result) => {
    console.log(query);
    if (err) {
      console.log("Error");
      console.error('Error executing login query:', err);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    } else {
      if (result.recordset.length > 0) {
        console.log("Successful");
        return res.json({ success: true, message: 'Login successful' });
      } else {
        console.log("Not Successful");
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
    }
  });
});

app.post('/deals', async (req, res) => {
  const { Kundenname, Unternehmen, Wert, Status } = req.body;
  console.log(Kundenname, Unternehmen, Wert, Status);

  const request = new sql.Request();

  request.input('Kundenname', sql.VarChar, Kundenname);
  request.input('Unternehmen', sql.VarChar, Unternehmen);
  request.input('Wert', sql.VarChar, Wert);
  request.input('Status', sql.VarChar, Status);

  const query = 'INSERT INTO dbo.Kunden (Kundenname, Unternehmen, Wert, Status) VALUES (@Kundenname, @Unternehmen, @Wert, @Status)';

  request.query(query, (err, result) => {
    if (err) {
      console.log("Error");
      console.error('Error executing login query:', err);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    } else {
      return res.status(201).json({ success: true, message: 'Deal added successfully' });
    }
  })
});

app.put('/deals/:KundenID', (req, res) => {
  const { KundenID, Status } = req.body;
  const request = new sql.Request();

  request.input('KundenID', sql.Int, parseInt(KundenID));
  request.input('Status', sql.VarChar, Status);
  console.log(KundenID, Status)

  const query = "UPDATE dbo.Kunden SET Status = @Status WHERE KundenID = @KundenID";


  request.query(query, (err, result) => {
    if (err) {
      console.error('Error updating card:', err);
      res.status(500).json({ success: false, message: 'Internal server error' });
    } else {
      res.status(200).json({ success: true, message: 'Card updated successfully' });
    }
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server listen on port ${port}`);
})
