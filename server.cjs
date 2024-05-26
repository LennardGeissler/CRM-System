const sql = require('mssql/msnodesqlv8');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
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
  const request = new sql.Request();
  request.query("select * from Mitarbeiter", (err, records) => {
    if (err) {
      console.log(err);
    }
    else {

    }
  })
})

app.get("/", (req, res, next) => {
  const request = new sql.Request();
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

  const request = new sql.Request();
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

app.post('/', async (req, res) => {
  const { name, password } = req.body;

  const request = new sql.Request();

  request.input('name', sql.VarChar, name);

  const query = `SELECT * FROM dbo.Mitarbeiter WHERE Name = @name`;

  request.query(query, async (err, result) => {
    if (err) {
      console.log("Error");
      console.error('Error executing login query:', err);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    } else {
      if (result.recordset.length > 0) {
        const user = result.recordset[0];
        const isMatch = await bcrypt.compare(password, user.HashedPasswort);
        if (isMatch) {
          return res.json({ success: true, message: 'Login successful' });
        } else {
          return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
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

app.get('/leadsByStatus', (req, res) => {
  const query = "SELECT Status, COUNT(*) as count FROM dbo.Kunden GROUP BY Status";
  const request = new sql.Request();
  request.query(query, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send(err.message);
    } else {
      res.json(result.recordset);
    }
  });
});

app.get('/leadDevelopmentData', (req, res) => {
  const query = "SELECT MonthYear, TargetLeads, ActualLeads FROM MonthlyData ORDER BY MonthYear ASC OFFSET 0 ROWS FETCH NEXT 12 ROWS ONLY";
  const request = new sql.Request();
  request.query(query, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Internal server error' });
    } else {
      res.json(result.recordset);
    }
  });
});

app.get('/incomeDevelopmentData', (req, res) => {
  const query = "SELECT MonthYear, Income FROM MonthlyData ORDER BY MonthYear ASC OFFSET 0 ROWS FETCH NEXT 12 ROWS ONLY";
  const request = new sql.Request();
  request.query(query, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Internal server error' });
    } else {
      res.json(result.recordset);
    }
  });
});

app.get('/tasks', (req, res) => {
  const query = 'SELECT * FROM dbo.Aufgaben';
  const request = new sql.Request();
  request.query(query, (err, result) => {
    if (err) {
      console.log(err);
    } else if (result) {
      res.json(result.recordset);
    } else {
      res.send("nothing here");
    }
  });
})

const port = 3000;
app.listen(port, () => {
  console.log(`Server listen on port ${port}`);
})
