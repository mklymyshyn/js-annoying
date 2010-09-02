
PROJECT_NAME='JavaScript Utilities'
FORMAT='html'
PROJECT_SUMMARY='README.txt'
FOOTER='&copy; 2009-2010 Max Klymyshyn'
DOC_BASE='utils'
JSDOCCMD='/Users/gabonsky/Bin/jsdoc/jsdoc.pl'
JSDOC_OUTPUT='docs'

doc:
	 perl $(JSDOCCMD) -d $(JSDOC_OUTPUT) --project-name $(PROJECT_NAME) --format $(FORMAT) --project-summary $(PROJECT_SUMMARY) --page-footer $(FOOTER) --recursive --private $(DOC_BASE) 
