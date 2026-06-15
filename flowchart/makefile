FUENTES := $(wildcard *.mmd)
PDF_INDIVIDUALES := 00a-portada.pdf $(FUENTES:.mmd=.pdf) 
RESULTADO_FINAL := simulador-de-neumatica-picuino-flowchart.pdf
GS := gswin32c
MMDC := mmdc

# ---------------------------------------------------------
# REGLAS DE COMPILACIÓN
# ---------------------------------------------------------

# 1. Regla principal: compila los archivos individuales y genera el consolidado
all: $(PDF_INDIVIDUALES) $(RESULTADO_FINAL)

# 2. Regla de sufijo: convierte cada .mmd de forma individual a su dimensión PDF nativa
%.pdf: %.mmd
	$(MMDC) -i $< -o $@

# 3. Regla de Ghostscript: unifica todos los archivos de la lista respetando sus tamaños
$(RESULTADO_FINAL): $(PDF_INDIVIDUALES)
	$(GS) -dBATCH -dNOPAUSE -q -sDEVICE=pdfwrite -sOutputFile=$(RESULTADO_FINAL) $(PDF_INDIVIDUALES)

# 4. Regla de limpieza: borra los PDFs intermedios y el consolidado para reiniciar
clean:
	$(RM) $(PDF_INDIVIDUALES) $(RESULTADO_FINAL)

# Declarar los comandos para evitar conflictos con archivos del mismo nombre
.PHONY: all clean
