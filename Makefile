.PHONY: deploy
deploy:
	rm deployment.tar.enc;
	tar cvf deployment.tar deployment/;
	travis encrypt-file deployment.tar;
