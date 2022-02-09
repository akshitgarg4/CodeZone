<Paper>
  <Card
    sx={{
      minWidth: 0,
      bgcolor: (theme) => (theme.palette.mode === "dark" ? "#272727" : "#fff"),
      boxShadow: (theme) =>
        theme.palette.mode === "dark" ? "unset" : "0 8px 16px 0 #BDC9D7",
    }}
  >
    <CardContent>
      {!userId && !labId && <p> Error !! Please Refresh the Page</p>}
      {userId && labId && <TextEditor documentId={`${userId}+${labId}`} />}
    </CardContent>
  </Card>
</Paper>;
