/*
   Picuino Pneumatic Simulator.

   Copyright © 2025 Carlos Félix Pardo Martín.

   This program is free software: you can redistribute it and/or modify
   it under the terms of the GNU General Public License as published by
   the Free Software Foundation, either version 3 of the License, or
   (at your option) any later version.

   This program is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU General Public License for more details.

   You should have received a copy of the GNU General Public License
   along with this program. If not, see <https://www.gnu.org/licenses/>.
*/

/* Global constants and variables */
const programVersion = '2.8';
const canvas = document.getElementById('canvas');
const grid = 10;
const lineWidth = 2;
const nearDist = 5;
const selectedColor = '#e06000';
const defaultColor = '#000000';
const textFont = '14px sans-serif';
const canvasScale = 2;
const minCanvasWidth = 320 * canvasScale;
const minCanvasHeight = 320 * canvasScale;
const airPressure = 1; // bar absolute
const compressorPressure = 6; // bar relative
const conductanceBase = 2000;
const minTimestamp = parseInt('1900000000', 16);


let drawMode = null;
let componentType = null;
let componentMove = null;
let componentEdit = null;
let editPipe = null;
let pipeMove = null;
let initPos = null;
let endPos = null;
let running = false;
let globalLang = null;
let mousePosition = null;
let stepTime = null;
let simulationActive = false;
let activateValvesTouchingBody = true;
let renderTime = 0;


/*************************************************************************/

const translations = {

  en: {
    title: 'Pneumatic Simulator - Picuino',
    closeConfirm: "Are you sure you want to leave this page?",
    aboutCloseBtn: 'Close Window',
    compareCloseBtn: 'Close Window',
    compareWindowTitle: 'Pneumatic Schematic Comparison Tool',
    compareBtn: 'Compare Files',
    fileMenu: 'File',
    fSwap: 'Swap Screen',
    fNew: 'New Schematic',
    fOpen: 'Open Schematic',
    fSave: 'Save Schematic',
    fSaveStudent: 'Student',
    fSaveTeacher: 'Teacher',
    fSavePNG: 'Save Image',
    fCompare: 'Compare Files',
    fAbout: 'About...',
    examplesMenu: 'Examples',
    singleMenu: 'Single',
    doubleMenu: 'Double',
    multipleMenu: 'Multiple',
    drawMenu: 'Draw',
    valvesMenu: 'Valves',
    cValve22m: 'Valve 2/2 manual',
    cValve32b: 'Valve 3/2 button',
    cValve32m: 'Valve 3/2 manual',
    cValve32r: 'Valve 3/2 with roller',
    cValve32p: 'Valve 3/2 pneu. pilot',
    cRoller: 'Roller of valve',
    cValve42m: 'Valve 4/2 manual',
    cValve52m: 'Valve 5/2 manual',
    cValve52p: 'Valve 5/2 pneu. pilot',
    auxValvesMenu: 'Aux. valves',
    cValveNret: 'Non-return valve',
    cValveFlow: 'Choke valve',
    cValveOr: 'OR valve',
    cValveAnd: 'AND valve',
    cylinderMenu: 'Cylinders',
    cCylinder1: 'Single-acting',
    cCylinder2: 'Double-acting',
    cPress: 'Compressor',
    cManometer: 'Manometer',
    cPipe: 'Pipe',
    cEscape: 'Escape',
    cText: 'Text',
    editMenu: 'Edit',
    eDelete: 'Delete',
    eMove: 'Move',
    eOptions: 'Options',
    eFlip: 'Flip',
    simulateMenu: 'Simulate',
    sInit: 'Init',
    sStep: "Step 's'",
    sStop: 'Stop',
    sContinue: 'Continue',
    sReset: 'Reset',
  },

  es: {
    title: 'Simulador Neumático - Picuino',
    closeConfirm: "¿Realmente desea salir de la página web?",
    aboutCloseBtn: 'Cerrar Ventana',
    compareCloseBtn: 'Cerrar Ventana',
    compareWindowTitle: 'Comparador de Esquemas Neumáticos',
    compareBtn: 'Comparar Archivos',
    fileMenu: 'Archivo',
    fSwap: 'Cambiar pantalla',
    fNew: 'Nuevo Esquema',
    fOpen: 'Abrir Esquema',
    fSave: 'Guardar Esquema',
    fSaveStudent: 'Alumno',
    fSaveTeacher: 'Profesor',
    fSavePNG: 'Guardar Imagen',
    fCompare: 'Comparar Archivos',
    fAbout: 'Sobre...',
    examplesMenu: 'Ejemplos',
    singleMenu: 'Simple',
    doubleMenu: 'Doble',
    multipleMenu: 'Múltiple',
    drawMenu: 'Dibujar',
    valvesMenu: 'Válvulas',
    cValve22m: 'Válvula 2/2 manual',
    cValve32b: 'Válvula 3/2 pulsador',
    cValve32m: 'Válvula 3/2 manual',
    cValve32r: 'Válvula 3/2 con rodillo',
    cRoller: 'Rodillo de válvula',
    cValve32p: 'Válvula 3/2 pilotada neum.',
    cValve42m: 'Válvula 4/2 manual',
    cValve52m: 'Válvula 5/2 manual',
    cValve52p: 'Válvula 5/2 pilotada neum.',
    auxValvesMenu: 'Válvulas aux.',
    cValveNret: 'Válvula antirretorno',
    cValveFlow: 'Válvula estranguladora',
    cValveOr: 'Válvula selectora (OR)',
    cValveAnd: 'Válvula simultaneidad (AND)',
    cylinderMenu: 'Cilindros',
    cCylinder1: 'Simple efecto',
    cCylinder2: 'Doble efecto',
    cPress: 'Compresor',
    cManometer: 'Manómetro',
    cPipe: 'Tubería',
    cEscape: 'Escape',
    cText: 'Texto',
    editMenu: 'Editar',
    eDelete: 'Borrar',
    eMove: 'Mover',
    eOptions: 'Opciones',
    eFlip: 'Voltear',
    simulateMenu: 'Simular',
    sInit: 'Iniciar',
    sStep: "Paso 's'",
    sStop: 'Detener',
    sContinue: 'Continuar',
    sReset: 'Reiniciar',
  }
}
