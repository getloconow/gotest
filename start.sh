
count=0
for i in `seq $1 $2`;do
    count=$(($count+3))

    sleep $count && go run src/main.go 0.0.0.0:$i &
done