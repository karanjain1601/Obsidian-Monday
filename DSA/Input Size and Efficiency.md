his highlights a key idea:

> As the input to an algorithm increases, the time required to run the algorithm may also increase.

Notice that we said _may_ increase. As we saw with the above examples, input size sometimes affects the run-time of the program and sometimes doesn't—it depends on the program.

### The rate of increase

So here's one thing that we know about this function: As the input increases, the number of lines executed also increases.

But we can go further than that! We can also say that _as the input increases, the number of lines executed increases by a proportional amount_. Increasing the input by 1 will cause 1 more line to get run. Increasing the input by 10 will cause 10 more lines to get run. Any change in the input is tied to a consistent, proportional change in the number of lines executed. This type of relationship is called a **linear relationship**, and we can see why if we graph it:

![Graph showing a linear increase in computational complexity.](https://video.udacity-data.com/topher/2019/March/5c911aa7_01-n-comparison-computational-complexity/01-n-comparison-computational-complexity.svg)

Derivative of ["Comparison of computational complexity"(opens in a new tab)](https://commons.wikimedia.org/wiki/File:Comparison_computational_complexity.svg) by [Cmglee(opens in a new tab)](https://commons.wikimedia.org/wiki/User:Cmglee). Used under [CC BY-SA 4.0(opens in a new tab)](https://creativecommons.org/licenses/by-sa/4.0/deed.en).

The horizontal axis, _n_, represents the size of the input (in this case, the number of times we want to print `"Hello!"`).

The vertical axis, _N_, represents the number of operations that will be performed. In this case, we're thinking of an "operation" as a single line of Python code (which is not the most accurate, but it will do for now).

We can see that if we give the function a larger input, this will result in more operations. And we can see the _rate_ at which this increase happens—the rate of increase is _linear_. Another way of saying this is that the number of operations increases at a constant rate.

If that doesn't quite seem clear yet, it may help to contrast it with an alternative possibility—a function where the operations increase at a rate that is _not_ constant.


Notice that when the input goes up by a certain amount, the number of operations goes up by the square of that amount. If the input is 22, the number of operations is 2222 or 44. If the input is 33, the number of operations is 3232 or 99.

To state this in general terms, if we have an input, nn, then the number of operations will be n2n2. This is what we would call a **quadratic** rate of increase.

Let's compare that with the **linear** rate of increase. In that case, when the input is nn, the number of operations is also nn.

Let's graph both of these rates so we can see them together:

![Graph showing linear and quadratic relationships.](https://video.udacity-data.com/topher/2019/March/5c9120f9_02-n-squared-comparison-computational-complexity/02-n-squared-comparison-computational-complexity.svg)

Derivative of ["Comparison of computational complexity"(opens in a new tab)](https://commons.wikimedia.org/wiki/File:Comparison_computational_complexity.svg) by [Cmglee(opens in a new tab)](https://commons.wikimedia.org/wiki/User:Cmglee). Used under [CC BY-SA 4.0(opens in a new tab)](https://creativecommons.org/licenses/by-sa/4.0/deed.en).

Our code with the nested `for` loop exhibits the quadratic n2n2 relationship on the left. Notice that this results in a _much_ faster rate of increase. As we ask our code to print larger and larger numbers of `"Hello!"`s, the number of operations the computer has to perform shoots up very quickly—much more quickly than our other function, which shows a linear increase.

This brings us to a second key point. We can add it to what we said earlier:

> As the input to an algorithm increases, the time required to run the algorithm may also increase—**and different algorithms may increase at different _rates_**.

Notice that if `n` is very small, it doesn't really matter which function we use—but as we put in larger values for `n`, the function with the nested loop will quickly become far less efficient.

We've looked here only at a couple of different rates—linear and quadratic. But there are many other possibilities. Here we'll show some of the common types of rates that come up when designing algorithms:

![Graph comparing computational complexity functions: constant, logarithmic, square root, linear, linearithmic, quadratic, and exponential, showing their growth rates with increasing input size \( n \).](https://video.udacity-data.com/topher/2019/March/5c92f7e6_00-all-comparison-computational-complexity/00-all-comparison-computational-complexity.svg)

["Comparison of computational complexity"(opens in a new tab)](https://commons.wikimedia.org/wiki/File:Comparison_computational_complexity.svg) by [Cmglee(opens in a new tab)](https://commons.wikimedia.org/wiki/User:Cmglee). Used under [CC BY-SA 4.0(opens in a new tab)](https://creativecommons.org/licenses/by-sa/4.0/deed.en).

We'll look at some of these other _orders_ as we go through the class. But for now, notice how dramatic a difference there is here between them! Hopefully you can now see that this idea of the _order_ or _rate of increase_ in the run-time of an algorithm is an essential concept when designing algorithms.

## Order

We should note that when people refer to the _rate of increase_ of an algorithm, they will sometimes instead use the term _order_. Or to put that another way:

> The _rate of increase_ of an algorithm is also referred to as the **order** of the algorithm.

For example, instead of saying "this relationship has a linear rate of increase", we could instead say, "the _order_ of this relationship is linear".

On the next page, we'll introduce something called _[[Big O Notation]]_, and you'll see that the "O" in the name refers to the **o**rder of the rate of increase.