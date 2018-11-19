## HOW TO

### Dev ENV

1. build image

```
docker-compose build dashboard
```

2. launch dev container

```
./docker/bin/container
```

3. start npm dev

```
./docker/bin/bash -c "npm install && npm run dev"
```

Enjoy edit your stuff and refresh http://localhost:8000 to view your changes :)
