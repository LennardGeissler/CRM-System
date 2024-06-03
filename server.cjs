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
          return res.json({ success: true, message: 'Login successful', MitarbeiterID: user.MitarbeiterID });
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

app.get('/projects', (req, res) => {
  const query = 'SELECT * FROM dbo.Projekte';
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

app.post('/customerName', async (req, res) => {
  const { rechnungsempfangerKundeID } = req.body;

  const request = new sql.Request();

  request.input('KundenID', sql.Int, parseInt(rechnungsempfangerKundeID));

  const query = `SELECT Kundenname FROM dbo.Kunden WHERE KundenID = @KundenID`;

  request.query(query, (err, result) => {
    if (err) {
      console.log("Error");
      console.error('Error executing login query:', err);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    } else {
      return res.status(201).json(result.recordset);
    }
  })
});

app.post('/employeeName', async (req, res) => {
  const { verantwortlicherMitarbeiterID } = req.body;

  const request = new sql.Request();

  request.input('MitarbeiterID', sql.Int, parseInt(verantwortlicherMitarbeiterID));

  const query = `SELECT Name FROM dbo.Mitarbeiter WHERE MitarbeiterID = @MitarbeiterID`;

  request.query(query, (err, result) => {
    if (err) {
      console.log("Error");
      console.error('Error executing login query:', err);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    } else {
      return res.status(201).json(result.recordset);
    }
  })
});

app.get('/address', (req, res) => {
  const query = "SELECT * FROM dbo.Adressen";

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
})

app.post('/address', async (req, res) => {
  const { addressID } = req.body;

  const request = new sql.Request();

  request.input('AdresseID', sql.Int, parseInt(addressID));

  const query = `SELECT Name FROM dbo.Adressen WHERE AdresseID = @AdresseID`;

  request.query(query, (err, result) => {
    if (err) {
      console.log("Error");
      console.error('Error executing login query:', err);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    } else {
      console.log(result.recordset);
      return res.status(201).json(result.recordset);
    }
  })
});

// Route zum Abrufen aller Kundendaten einschließlich Adresse basierend auf KundenID
app.post('/customerDetails', async (req, res) => {
  const { KundenID } = req.body;

  const request = new sql.Request();
  request.input('KundenID', sql.Int, parseInt(KundenID));

  const query = `
    SELECT * 
    FROM dbo.Kunden AS K
    JOIN dbo.Adressen AS A ON K.AdresseID = A.AdresseID
    WHERE K.KundenID = @KundenID
  `;

  request.query(query, (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ success: false, message: 'Internal server error' });
    } else {
      res.status(200).json(result.recordset);
    }
  });
});

app.get('/events', (req, res) => {
  const query = 'SELECT * FROM dbo.Events';
  const request = new sql.Request();
  request.query(query, (err, result) => {
    if (err) {
      console.error('Error fetching events:', err);
      res.status(500).json({ success: false, message: 'Internal server error' });
    } else {
      res.json(result.recordset);
    }
  });
});

// Add a new event
app.post('/events', (req, res) => {
  const { Title, Start, End } = req.body;
  console.log(Title, Start, End);
  const startDate = new Date(Start);
  const endDate = new Date(End);

  const request = new sql.Request();

  request.input('Title', sql.VarChar, Title);
  request.input('Start', sql.DateTime, startDate);
  request.input('End', sql.DateTime, endDate);

  const query = `
    INSERT INTO dbo.Events ([Title], [Start], [End])
    VALUES (@Title, @Start, @End)
  `;

  // Execute the query
  request.query(query, (err, result) => {
    if (err) {
      console.error('Error adding event:', err);
      res.status(500).json({ success: false, message: 'Internal server error' });
    } else {
      res.status(201).json({ success: true, message: 'Event added successfully' });
    }
  });
});

app.delete('/events/:eventId', (req, res) => {
  const eventId = req.params.eventId;

  // Query to delete the event from the database
  const query = `DELETE FROM Events WHERE EventID = ${eventId}`;

  // Execute the query
  sql.query(query, (err, result) => {
    if (err) {
      console.error('Error deleting event:', err);
      res.status(500).json({ success: false, message: 'Internal server error' });
    } else {
      res.status(200).json({ success: true, message: 'Event deleted successfully' });
    }
  });
});

app.post('/employeeData', async (req, res) => {
  const { MitarbeiterID } = req.body;
  const request = new sql.Request();
  request.input('MitarbeiterID', sql.Int, parseInt(MitarbeiterID));

  const query = `
    SELECT * 
    FROM dbo.Mitarbeiter 
    WHERE MitarbeiterID = @MitarbeiterID
  `;

  request.query(query, (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ success: false, message: 'Internal server error' });
    } else {
      res.status(200).json(result.recordset);
    }
  });
});

app.post('/tasks', (req, res) => {
  const { Aufgabe, Person, Unteraufgaben, Deadline, Status } = req.body;
  const deadlineDate = new Date(Deadline);

  const request = new sql.Request();

  request.input('Aufgabe', sql.VarChar, Aufgabe);
  request.input('Person', sql.VarChar, Person);
  request.input('Unteraufgaben', sql.VarChar, Unteraufgaben);
  request.input('Deadline', sql.DateTime, deadlineDate);
  request.input('Status', sql.VarChar, Status);

  const query = `
    INSERT INTO dbo.Aufgaben ([Aufgabe], [Person], [Unteraufgaben], [Deadline], [Status])
    VALUES (@Aufgabe, @Person, @Unteraufgaben, @Deadline, @Status)
  `;

  request.query(query, (err, result) => {
    if (err) {
      console.error('Error adding task:', err);
      res.status(500).json({ success: false, message: 'Internal server error' });
    } else {
      res.status(201).json({ success: true, message: 'Task added successfully' });
    }
  });
});

app.delete('/tasks/:taskId', (req, res) => {
  const taskId = req.params.taskId;

  const query = `DELETE FROM dbo.Aufgaben WHERE ID = @taskId`;
  
  const request = new sql.Request();
  request.input('taskId', sql.Int, taskId);

  request.query(query, (err, result) => {
      if (err) {
          console.error('Error deleting task:', err);
          res.status(500).json({ success: false, message: 'Internal server error' });
      } else {
          res.status(200).json({ success: true, message: 'Task deleted successfully' });
      }
  });
});

app.delete('/projects/:projectId', (req, res) => {
  const projectId = req.params.projectId;

  const query = `DELETE FROM dbo.Projekte WHERE ProjektID = @projectId`;
  
  const request = new sql.Request();
  request.input('projectId', sql.Int, projectId);

  request.query(query, (err, result) => {
      if (err) {
          console.error('Error deleting task:', err);
          res.status(500).json({ success: false, message: 'Internal server error' });
      } else {
          res.status(200).json({ success: true, message: 'Task deleted successfully' });
      }
  });
});



const port = 3000;
const host = '0.0.0.0';
app.listen(port, host, () => {
  console.log(`Server listen on port ${port}`);
})
