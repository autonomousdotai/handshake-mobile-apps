.PHONY: deploy
deploy:
	rm -f deployment.tar.enc;
	tar cvf deployment.tar deployment/;
	travis encrypt-file deployment.tar;
