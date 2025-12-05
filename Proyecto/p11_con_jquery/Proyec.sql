-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Tiempo de generación: 05-12-2025 a las 21:08:08
-- Versión del servidor: 10.4.28-MariaDB
-- Versión de PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `Proyec`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `bitacora`
--

CREATE TABLE `bitacora` (
  `id` int(11) NOT NULL,
  `id_recurso` int(11) NOT NULL,
  `fecha` datetime DEFAULT current_timestamp(),
  `tipo_archivo` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `bitacora`
--

INSERT INTO `bitacora` (`id`, `id_recurso`, `fecha`, `tipo_archivo`) VALUES
(1, 1, '2025-12-03 11:07:11', 'pdf'),
(2, 1, '2025-12-03 11:08:03', 'pdf'),
(3, 1, '2025-12-03 11:24:34', 'pdf'),
(4, 1, '2025-12-03 11:25:50', 'pdf'),
(5, 1, '2025-12-03 11:29:05', 'pdf'),
(6, 1, '2025-12-03 11:35:52', 'pdf'),
(7, 2, '2025-12-03 13:29:36', 'xlsx'),
(8, 2, '2025-12-03 13:30:59', 'xlsx'),
(9, 2, '2025-12-03 16:44:17', 'xlsx'),
(10, 4, '2025-12-03 16:45:18', 'txt'),
(11, 6, '2025-12-05 13:13:08', 'png'),
(12, 8, '2025-12-05 13:40:08', 'pdf');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `recursos`
--

CREATE TABLE `recursos` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `autor` varchar(100) DEFAULT NULL,
  `departamento` varchar(100) DEFAULT NULL,
  `empresa` varchar(100) DEFAULT NULL,
  `fecha_creacion` date DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `ruta_archivo` varchar(255) NOT NULL,
  `tipo_archivo` varchar(10) DEFAULT NULL,
  `eliminado` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `recursos`
--

INSERT INTO `recursos` (`id`, `nombre`, `autor`, `departamento`, `empresa`, `fecha_creacion`, `descripcion`, `ruta_archivo`, `tipo_archivo`, `eliminado`) VALUES
(1, 'ProyectoTecweb', 'Juan Carlos Conde ', 'Computación ', 'BUAP', '2025-12-03', 'Guia de proyecto ', '693078da04f52_Proyecto_C.pdf', 'pdf', 0),
(2, 'Base de Datos Cancer', 'Diego Perez ', 'Sistemas ', 'BUAP', '2025-12-03', 'Base de datos tumores cáncer de mamá ', '693079bc807e4_-comparacion.xlsx', 'xlsx', 0),
(3, 'ej', 'ej', 'ej', 'ej', '2025-12-03', 'ej\r\n', '69307a30580dd_nueva_base_1_invertida.xlsx', 'xlsx', 1),
(4, 'ej', 'ej', 'ej', 'ej', '2025-12-03', 'q', '6930bd6c2b1c1_arch.txt', 'txt', 1),
(5, 'Reporte ', 'Diego Rojas ', 'ITI ', 'BUAP ', '2025-12-04', 'Resultados de comparación entre bases de datos de cancer ', '69323ccbb9f84_reporte_validacion_102913.txt', 'txt', 0),
(6, 'Redes ', 'Osvaldo ', 'ITI', 'BUAP', '2025-12-05', 'Imagen de prueba ', '69332e8def82f_redes.png', 'png', 0),
(7, 'po', 'po', 'po', 'po', '2025-12-05', 'p', '693334d0398fa_Mapas_Carreras_ITI_v2802 (1)_231109_111128.pdf', 'pdf', 1),
(8, 'q', 'q', 'q', 'q', '2025-12-05', '', '6933350d9b5f6_Proyecto_C.pdf', 'pdf', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `usuario` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `nombre` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `usuario`, `password`, `nombre`) VALUES
(1, 'admin', '123', 'admin');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `bitacora`
--
ALTER TABLE `bitacora`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `recursos`
--
ALTER TABLE `recursos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `usuario` (`usuario`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `bitacora`
--
ALTER TABLE `bitacora`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `recursos`
--
ALTER TABLE `recursos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
