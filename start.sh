

for i in `seq $1 $2`;do
    go run src/main.go 0.0.0.0:$i
done