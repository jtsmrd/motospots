FROM php:7.3-fpm

RUN apt-get update

RUN apt-get install -y zlib1g-dev g++ git libicu-dev zip libzip-dev zip \
    && docker-php-ext-install intl opcache pdo pdo_mysql \
    && pecl install apcu \
    && docker-php-ext-enable apcu \
    && docker-php-ext-configure zip \
    && docker-php-ext-install zip

RUN apt-get install -y nodejs npm

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

RUN curl -sS https://get.symfony.com/cli/installer | bash
RUN mv /root/.symfony/bin/symfony /usr/local/bin/symfony
RUN git config --global user.email "jtsmrdel@gmail.com" \
    && git config --global user.name "JT Smrdel"

COPY . /var/www/dev.motospots.com
WORKDIR /var/www/dev.motospots.com

RUN PATH=$PATH:/var/www/dev.motospots.com/vendor/bin:bin

#RUN composer install

#RUN npm install &&\
#    npm build