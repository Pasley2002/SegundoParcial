# 🧾 Sistema de Gestión y Facturación

Este proyecto es una aplicación web desarrollada con **Angular** para la gestión de productos y la generación de facturas. Permite agregar productos a un carrito, revisar el total, y generar facturas en **pesos (ARS)** o **dólares (USD)**, utilizando la cotización oficial provista por la API del BCRA.

## 🚀 Tecnologías utilizadas

- Angular
- TypeScript
- HTML / CSS
- Bootstrap
- API REST
- LocalStorage para persistencia de datos
- API del BCRA (cotización dólar oficial)

## 📦 Funcionalidades principales

- Alta de usuarios (registro) y login utilizando LocalStorage
- ABM de productos (crear, editar, eliminar)
- Agregado de productos al carrito
- Visualización del carrito y generación de factura
- Cálculo en ARS y USD según cotización actual
- Validaciones de formularios

## 💾 Persistencia

> Este proyecto **no utiliza backend ni base de datos**.  
> Toda la información (usuarios, productos, carrito) se guarda localmente en el navegador mediante `LocalStorage`.