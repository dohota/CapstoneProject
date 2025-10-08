Imports Npgsql
Public Class Form1
    'Private connString As String = "Host=130.33.112.233;Port=5432;Username=hj45h4gejgf;
    'Password=s56jbjgf45j4gg054hcsfdsf;Database=jpdbrhtt"
    Private connString As String =
        "Host=azure-user.postgres.database.azure.com;
        Port=5432;
        Username=haorandong;
        Password=s56jbjgf45j4gg054hcsfdsfA;
        Database=postgres;
        SSL Mode=Require;
        Trust Server Certificate=True"
    Private conn As NpgsqlConnection
    Private WithEvents ButtonConnect As New Button()
    Private WithEvents ButtonAdd As New Button()
    Private WithEvents ButtonDelete As New Button()
    Private WithEvents ButtonUpdate As New Button()
    Private WithEvents ButtonSearch As New Button()
    Private txtOutput As New TextBox()
    Private Sub Form1_Load(sender As Object, e As EventArgs) Handles MyBase.Load
        ButtonConnect.Text = "Connect"
        ButtonConnect.Location = New Point(30, 30)
        Me.Controls.Add(ButtonConnect)
    End Sub
    Private Sub ButtonConnect_Click(sender As Object, e As EventArgs) Handles ButtonConnect.Click
        Try
            conn = New NpgsqlConnection(connString)
            conn.Open()
            MessageBox.Show("Connected to database successfully!")
            ButtonAdd.Text = "Add"
            ButtonAdd.Location = New Point(30, 70)
            Me.Controls.Add(ButtonAdd)
            ButtonDelete.Text = "Delete"
            ButtonDelete.Location = New Point(30, 110)
            Me.Controls.Add(ButtonDelete)
            ButtonUpdate.Text = "Change"
            ButtonUpdate.Location = New Point(30, 150)
            Me.Controls.Add(ButtonUpdate)
            ButtonSearch.Text = "Search"
            ButtonSearch.Location = New Point(30, 190)
            Me.Controls.Add(ButtonSearch)

            txtOutput.Multiline = True
            txtOutput.ScrollBars = ScrollBars.Vertical
            txtOutput.Font = New Font("Consolas", 10)
            txtOutput.Location = New Point(200, 30)
            txtOutput.Size = New Size(400, 300)
            Me.Controls.Add(txtOutput)

        Catch ex As Exception
            MessageBox.Show("Failed to connect: " & ex.Message)
        End Try
    End Sub
    Private Sub ButtonAdd_Click(sender As Object, e As EventArgs) Handles ButtonAdd.Click
        Dim username As String = InputBox("Enter username:", "Add User")
        Dim ageStr As String = InputBox("Enter email:", "Add User")
        Dim email As Integer
        If Not Integer.TryParse(ageStr, email) Then
            MessageBox.Show("Invalid email input.")
            Return
        End If
        Dim created As String = InputBox("Enter created_at:", "Add User")
        Dim created_at As DateTime = DateTime.Parse(created)
        Dim sql As String = "INSERT INTO users (username, email,created_at) VALUES (@username, @email,@created_at);"
        Using cmd As New NpgsqlCommand(sql, conn)
            cmd.Parameters.AddWithValue("username", username)
            cmd.Parameters.AddWithValue("email", email)
            cmd.Parameters.AddWithValue("created_at", created_at)
            Try
                Dim rows As Integer = cmd.ExecuteNonQuery()
                MessageBox.Show($"{rows} row inserted。")
            Catch ex As Exception
                MessageBox.Show("WRONG：" & ex.Message)
            End Try
        End Using
    End Sub
    Private Sub ButtonDelete_Click(sender As Object, e As EventArgs) Handles ButtonDelete.Click
        Dim username As String = InputBox("Enter name to delete:", "Delete User")
        Dim sql As String = "DELETE FROM users WHERE username = @username;"
        Using cmd As New NpgsqlCommand(sql, conn)
            cmd.Parameters.AddWithValue("username", username)
            Try
                Dim rows As Integer = cmd.ExecuteNonQuery()
                MessageBox.Show($"{rows} row(s) deleted.")
            Catch ex As Exception
                MessageBox.Show("WRONG：" & ex.Message)
            End Try
        End Using
    End Sub
    Private Sub ButtonUpdate_Click(sender As Object, e As EventArgs) Handles ButtonUpdate.Click
        Dim username As String = InputBox("Enter username to update:", "Update User")
        Dim ageStr As String = InputBox("Enter new email:", "Update User")
        Dim email As Integer
        If Not Integer.TryParse(ageStr, email) Then
            MessageBox.Show("Invalid email input.")
            Return
        End If
        Dim sql As String = "UPDATE users SET email = @email WHERE username = @username;"
        Using cmd As New NpgsqlCommand(sql, conn)
            cmd.Parameters.AddWithValue("email", email)
            cmd.Parameters.AddWithValue("username", username)
            Try
                Dim rows As Integer = cmd.ExecuteNonQuery()
                MessageBox.Show($"{rows} row(s) updated.")
            Catch ex As Exception
                MessageBox.Show("WRONG：" & ex.Message)
            End Try
        End Using
    End Sub
    Private Sub ButtonShowTable_Click(sender As Object, e As EventArgs) Handles ButtonSearch.Click
        Dim sql As String = "SELECT username, email, created_at FROM users;"
        Dim output As New Text.StringBuilder()
        Try
            Using cmd As New NpgsqlCommand(sql, conn)
                Using reader As NpgsqlDataReader = cmd.ExecuteReader()
                    output.AppendLine(String.Format("{0,-5} {1,-17} {2,-5}", "username", "number", "created time"))
                    output.AppendLine(New String("-"c, 30))

                    While reader.Read()
                        Dim username As String = reader.GetString(0)
                        Dim email As String = reader.GetString(1)
                        Dim created_at As DateTime = reader.GetDateTime(2)
                        output.AppendLine(String.Format("{0,-5} {1,-17} {2,-5}", username, email, created_at))
                    End While
                End Using
            End Using
            txtOutput.Text = output.ToString()
        Catch ex As Exception
            MessageBox.Show("WRONG：" & ex.Message)
        End Try
    End Sub
    ' 窗体关闭时释放数据库连接
    Protected Overrides Sub OnFormClosing(e As FormClosingEventArgs)
        MyBase.OnFormClosing(e)
        If conn IsNot Nothing Then
            conn.Close()
            conn.Dispose()
        End If
    End Sub
End Class
