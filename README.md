# Quick start

    ## Install packages before to generate package-lock.json
    - name: Install packages
	  run: npm install
	  
    - name: Check Node Package License
      uses: caongocthien/check-license@1.0.2
	  with:
	    - with:
		    ## List of license trusted
            licenses: 'MIT,ISC'
            



