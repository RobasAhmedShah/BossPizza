import React from 'react';
import { Calendar, User, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Blog: React.FC = () => {
  const blogPosts = [
    {
      id: 1,
      title: "Why Authentic Pizza Is Taking Over Pakistan's Food Scene",
      excerpt: "Pakistan's love for food is deep-rooted—but in recent years, one dish has risen to cult status: pizza. But not just any pizza...",
      content: `Pakistan's love for food is deep-rooted—but in recent years, one dish has risen to cult status: pizza. But not just any pizza. We're talking about authentic, oven-baked, stone-crusted pizza made with real ingredients and no shortcuts.

Consumers are now craving quality over quantity, and foodies across the nation are lining up to experience flavors inspired by Italy and perfected for Pakistani taste buds. Whether it's the wood-fired aroma, stretchy mozzarella, or hand-tossed crusts, the demand for true artisan pizza is skyrocketing.

The shift towards authentic pizza represents more than just a food trend—it's a cultural movement. Pakistani consumers are becoming more discerning, seeking experiences that transport them beyond the ordinary. They want to taste the difference that comes from using San Marzano tomatoes, buffalo mozzarella, and dough that's been fermented for days, not hours.

This evolution in taste preferences has created a new category of pizza lovers who appreciate the craft behind each slice. They understand that authentic pizza isn't just about toppings—it's about the foundation: the crust, the sauce, the cheese, and the technique that brings them all together.

As more Pakistanis travel internationally and experience authentic Italian and American pizzerias, they return home with elevated expectations. They're no longer satisfied with mass-produced alternatives when they know what real pizza should taste like.

The future of Pakistan's pizza scene belongs to those who respect the craft, honor the traditions, and aren't afraid to invest in quality ingredients and proper techniques. This is why authentic pizza isn't just taking over—it's here to stay.`,
      author: "Iftikhar Tahir",
      date: "2024-01-15",
      readTime: "5 min read",
      image: "https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=800",
      category: "Food Trends"
    },
    {
      id: 2,
      title: "5 Secrets to the Perfect Pizza Crust (And Why Ours is Different)",
      excerpt: "What makes a crust unforgettable? At our pizzeria, we obsess over it. Here's what sets us apart...",
      content: `What makes a crust unforgettable? At our pizzeria, we obsess over it. Here's what sets us apart:

**1. Cold Fermentation for 48 Hours to Enhance Flavor**
Most pizzerias rush their dough, but we believe good things take time. Our dough undergoes a slow, cold fermentation process for a full 48 hours. This extended fermentation develops complex flavors and creates the perfect texture—crispy on the outside, chewy on the inside, with those characteristic air bubbles that make each bite a delight.

**2. Italian 00 Flour for the Softest, Crispiest Texture**
Not all flour is created equal. We import authentic Italian 00 flour, which has a lower protein content and finer grind than regular flour. This creates a more tender, easier-to-digest crust that still maintains the structural integrity needed for our generous toppings.

**3. Stone-Baked Ovens That Give the Perfect Char**
Our stone ovens reach temperatures of over 900°F, creating that signature leopard-spotted char that's impossible to achieve in conventional ovens. The intense heat creates a beautiful contrast—a crispy exterior that gives way to a soft, airy interior.

**4. No Artificial Enhancers, Ever**
We believe in the purity of ingredients. Our dough contains only flour, water, salt, yeast, and a touch of olive oil. No dough conditioners, no preservatives, no shortcuts. Just time-honored ingredients working together to create something magical.

**5. Tested by Chefs, Loved by Customers**
Every batch of dough is tested for consistency, flavor, and texture. Our chefs have spent years perfecting the hydration levels, fermentation timing, and baking techniques to ensure every crust meets our exacting standards.

We believe the crust is the canvas of the pizza—and we treat it with the respect it deserves. When you taste our crust, you're experiencing the culmination of traditional techniques, premium ingredients, and passionate craftsmanship.`,
      author: "Chef Marco",
      date: "2024-01-10",
      readTime: "4 min read",
      image: "https://images.pexels.com/photos/4393021/pexels-photo-4393021.jpeg?auto=compress&cs=tinysrgb&w=800",
      category: "Behind the Scenes"
    },
    {
      id: 3,
      title: "Inside Our Kitchen: The Art of Crafting Pizza With Passion",
      excerpt: "Our kitchen isn't just where food is made. It's where passion is baked into every layer...",
      content: `Our kitchen isn't just where food is made. It's where passion is baked into every layer. From sourcing the freshest tomatoes to hand-chopping basil, we go the extra mile.

**The Heart of Our Operation**
Step into our kitchen and you'll immediately feel the energy. It's not just the heat from our stone ovens—it's the passion of our team. Every pizza maker, every prep cook, every chef understands that they're not just making food; they're creating experiences that will become memories.

**Sourcing the Finest Ingredients**
Our day begins before dawn with the careful selection of ingredients. We work directly with local farmers for the freshest vegetables, import our cheeses from trusted Italian suppliers, and hand-select every tomato that goes into our sauce. Quality isn't negotiable—it's the foundation of everything we do.

**The Ritual of Pizza Making**
Watch our pizza makers at work and you'll witness a beautiful dance. The way they stretch the dough, the precision with which they ladle the sauce, the artful distribution of toppings—every movement is deliberate, practiced, and filled with respect for the craft.

**Training and Tradition**
Every staff member is trained not just in technique but in respecting the art of pizza-making. They learn about the history of pizza, the importance of each ingredient, and the cultural significance of what they're creating. This knowledge transforms their work from a job into a calling.

**The Difference You Can Taste**
This is why when you take a bite, it's not just delicious—it's an experience. You can taste the care in every element: the perfectly balanced sauce, the high-quality cheese that melts just right, the fresh herbs that brighten every bite, and the crust that provides the perfect foundation for it all.

**Our Promise to You**
We promise that every pizza that leaves our kitchen has been crafted with the same passion and attention to detail that we'd put into a meal for our own family. Because in our kitchen, every customer is family, and every pizza is a labor of love.

When you choose us, you're not just ordering pizza—you're supporting a team of artisans who believe that great food has the power to bring people together and create lasting memories.`,
      author: "Kitchen Team",
      date: "2024-01-05",
      readTime: "6 min read",
      image: "https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=800",
      category: "Our Story"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Blog</h1>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto">
              Stories, insights, and passion from behind the scenes
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-16">
          {blogPosts.map((post, index) => (
            <article key={post.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              {/* Featured Image */}
              <div className="aspect-video overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Content */}
              <div className="p-8">
                {/* Meta Information */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                  <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full font-medium">
                    {post.category}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(post.date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{post.readTime}</span>
                  </div>
                </div>

                {/* Title */}
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 hover:text-primary-600 transition-colors">
                  {post.title}
                </h2>

                {/* Content */}
                <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed">
                  {post.content.split('\n\n').map((paragraph, pIndex) => {
                    if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                      // Handle bold headings
                      return (
                        <h3 key={pIndex} className="text-xl font-bold text-gray-900 mt-6 mb-3">
                          {paragraph.replace(/\*\*/g, '')}
                        </h3>
                      );
                    } else {
                      return (
                        <p key={pIndex} className="mb-4">
                          {paragraph}
                        </p>
                      );
                    }
                  })}
                </div>

                {/* Read More Link */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <Link
                    to={`/blog/${post.id}`}
                    className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-semibold transition-colors group"
                  >
                    <span>Continue Reading</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="mt-16 bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
          <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
            Subscribe to our newsletter for the latest stories, recipes, and behind-the-scenes content from Big Boss Pizza.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;