CREATE TABLE club.dbo.Alumno (
	IdAlumno bigint IDENTITY(1,1) NOT NULL,
	NameAlumno nvarchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	NameApellidos nvarchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	ValueDni nvarchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	DateNacimiento date NULL
);
INSERT INTO club.dbo.Alumno (NameAlumno,NameApellidos,ValueDni,DateNacimiento) VALUES
	 (N'Laura',N'Pérez Torres',N'70429512Q','2000-09-06'),
	 (N'Marta',N'Pérez Torres',N'01942124G','1011-01-11');
	
CREATE TABLE club.dbo.Tutor (
	IdTutor bigint IDENTITY(1,1) NOT NULL,
	NameTutor nvarchar(256) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	ValueDni nvarchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	ValueTelefono nvarchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	ValueEmail nvarchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL
);
INSERT INTO club.dbo.Tutor (NameTutor,ValueDni,ValueTelefono,ValueEmail) VALUES
	 (N'Beatriz Torres San José',N'07497763Q',N'619668797',N'btsjlg@yahoo.es'),
	 (N'Guillermo Pérez De Ramón',N'02882164B',N'675506822',N'gpderamon@gmail.com');
	 
CREATE TABLE club.dbo.DatosBancarios (
	IdDatos bigint IDENTITY(1,1) NOT NULL,
	ValueIBAN nvarchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	NameTitular nvarchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	ValueDni nvarchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL
);

INSERT INTO club.dbo.Tutor (1, N'ES2700495133912110066224',	N'BEATRIZ TORRES SAN JOSE',	N'07497763Q');