
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/components/ui/use-toast";
import { 
  trainModel, 
  loadTrainedModel, 
  saveTrainedModel, 
  exportTrainingData, 
  importTrainingData,
  ModelWeights,
  TrainingExample
} from "@/utils/searchUtils";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/components/ProductCard";

const ModelTraining = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [trainingData, setTrainingData] = useState<TrainingExample[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isTraining, setIsTraining] = useState(false);
  const [modelWeights, setModelWeights] = useState<ModelWeights>({
    exactMatchWeight: 3.0,
    bm25Weight: 2.0,
    semanticWeight: 2.5,
    popularityWeight: 1.0,
    recencyWeight: 0.5
  });
  const [learningRate, setLearningRate] = useState(0.01);
  const [epochs, setEpochs] = useState(50);
  const [newQuery, setNewQuery] = useState("");
  const [newProductId, setNewProductId] = useState("");
  const [isRelevant, setIsRelevant] = useState(true);
  
  // Load saved model and products on component mount
  useEffect(() => {
    const loadSavedModel = () => {
      const savedWeights = loadTrainedModel();
      if (savedWeights) {
        setModelWeights(savedWeights);
        toast({
          title: "Model loaded",
          description: "Successfully loaded saved model weights from local storage",
        });
      }
    };
    
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*');
          
        if (error) throw error;
        
        // Map to Product type
        const productsList = (data || []).map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          image: item.image || '',
          farmer: {
            id: item.farmer_id || 0,
            name: 'Farmer', 
            location: 'Unknown Location'
          },
          rating: item.rating || 0,
          reviews: item.reviews_count || 0,
          isOrganic: item.organic || false,
          isLocal: item.local || false, 
          isSeasonal: item.seasonal || false,
          category: item.category || '',
          stock: item.stock || 0,
          description: item.description || ''
        })) as Product[];
        
        setProducts(productsList);
      } catch (err) {
        console.error("Error fetching products:", err);
        toast({
          title: "Error",
          description: "Failed to fetch products for training",
          variant: "destructive",
        });
      }
    };
    
    loadSavedModel();
    fetchProducts();
    
    // Try to load training data from localStorage
    try {
      const savedTrainingData = localStorage.getItem('searchTrainingData');
      if (savedTrainingData) {
        setTrainingData(JSON.parse(savedTrainingData));
      }
    } catch (err) {
      console.error("Error loading training data:", err);
    }
  }, [toast]);
  
  // Save training data to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem('searchTrainingData', JSON.stringify(trainingData));
    } catch (err) {
      console.error("Error saving training data:", err);
    }
  }, [trainingData]);
  
  const handleAddExample = () => {
    if (!newQuery || !newProductId) {
      toast({
        title: "Validation error",
        description: "Please provide both query and product ID",
        variant: "destructive",
      });
      return;
    }
    
    const productId = parseInt(newProductId);
    if (isNaN(productId)) {
      toast({
        title: "Invalid product ID",
        description: "Product ID must be a number",
        variant: "destructive",
      });
      return;
    }
    
    const product = products.find(p => p.id === productId);
    if (!product) {
      toast({
        title: "Product not found",
        description: `No product found with ID ${productId}`,
        variant: "destructive",
      });
      return;
    }
    
    const newExample: TrainingExample = {
      query: newQuery,
      productId,
      isRelevant,
    };
    
    setTrainingData(prev => [...prev, newExample]);
    
    toast({
      title: "Example added",
      description: `Added training example for "${newQuery}" and product "${product.name}"`,
    });
    
    // Clear input fields
    setNewQuery("");
    setNewProductId("");
  };
  
  const handleRemoveExample = (index: number) => {
    setTrainingData(prev => prev.filter((_, i) => i !== index));
    
    toast({
      title: "Example removed",
      description: "Training example removed successfully",
    });
  };
  
  const handleStartTraining = async () => {
    if (trainingData.length === 0) {
      toast({
        title: "No training data",
        description: "Please add training examples before starting training",
        variant: "destructive",
      });
      return;
    }
    
    if (products.length === 0) {
      toast({
        title: "No products",
        description: "Product data is required for training",
        variant: "destructive",
      });
      return;
    }
    
    setIsTraining(true);
    
    try {
      const trainedWeights = await trainModel(
        trainingData,
        products,
        learningRate,
        epochs
      );
      
      setModelWeights(trainedWeights);
      
      toast({
        title: "Training complete",
        description: "Model trained successfully with updated weights",
      });
    } catch (err) {
      console.error("Error during training:", err);
      toast({
        title: "Training error",
        description: "An error occurred during model training",
        variant: "destructive",
      });
    } finally {
      setIsTraining(false);
    }
  };
  
  const handleManualWeightUpdate = () => {
    saveTrainedModel(modelWeights);
    
    toast({
      title: "Weights updated",
      description: "Model weights updated and saved manually",
    });
  };
  
  const handleExportTrainingData = () => {
    if (trainingData.length === 0) {
      toast({
        title: "No training data",
        description: "No training examples to export",
        variant: "destructive",
      });
      return;
    }
    
    exportTrainingData(trainingData);
    
    toast({
      title: "Data exported",
      description: "Training data exported successfully",
    });
  };
  
  const handleImportTrainingData = async () => {
    const importedData = await importTrainingData();
    
    if (importedData) {
      setTrainingData(importedData);
      
      toast({
        title: "Data imported",
        description: `Imported ${importedData.length} training examples`,
      });
    } else {
      toast({
        title: "Import failed",
        description: "Failed to import training data",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold mb-2 text-harvest-dark">
            Search Model Training
          </h1>
          <p className="text-gray-600 mb-6">
            Train and optimize your search relevance model using your own data
          </p>

          <Tabs defaultValue="training-data">
            <TabsList className="mb-4">
              <TabsTrigger value="training-data">Training Data</TabsTrigger>
              <TabsTrigger value="model-training">Training</TabsTrigger>
              <TabsTrigger value="model-weights">Model Weights</TabsTrigger>
            </TabsList>
            
            <TabsContent value="training-data">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-1">
                  <CardHeader>
                    <CardTitle>Add Training Example</CardTitle>
                    <CardDescription>
                      Create examples of relevant and irrelevant search results
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Search Query</label>
                        <Input 
                          placeholder="e.g., organic apples" 
                          value={newQuery}
                          onChange={(e) => setNewQuery(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Product ID</label>
                        <Input 
                          placeholder="e.g., 123" 
                          value={newProductId}
                          onChange={(e) => setNewProductId(e.target.value)}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          id="relevance"
                          checked={isRelevant}
                          onChange={(e) => setIsRelevant(e.target.checked)}
                          className="rounded text-harvest-primary focus:ring-harvest-primary"
                        />
                        <label htmlFor="relevance" className="text-sm">
                          Is this result relevant for the query?
                        </label>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      onClick={handleAddExample}
                      className="w-full"
                    >
                      Add Example
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Training Examples</CardTitle>
                    <CardDescription>
                      {trainingData.length} examples available for training
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {trainingData.length > 0 ? (
                      <div className="space-y-4 max-h-[400px] overflow-y-auto">
                        {trainingData.map((example, index) => (
                          <div 
                            key={index} 
                            className="flex justify-between items-center p-4 border rounded bg-white"
                          >
                            <div>
                              <p className="font-medium">"{example.query}"</p>
                              <p className="text-sm text-gray-500">
                                Product ID: {example.productId}{' '}
                                <span className={example.isRelevant ? "text-green-500" : "text-red-500"}>
                                  ({example.isRelevant ? 'Relevant' : 'Not Relevant'})
                                </span>
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              onClick={() => handleRemoveExample(index)}
                              className="h-8 w-8 p-0"
                            >
                              ✕
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        No training examples added yet.
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button 
                      variant="outline" 
                      onClick={handleImportTrainingData}
                    >
                      Import Data
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={handleExportTrainingData}
                      disabled={trainingData.length === 0}
                    >
                      Export Data
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="model-training">
              <Card>
                <CardHeader>
                  <CardTitle>Train Search Model</CardTitle>
                  <CardDescription>
                    Train your model using the provided examples to optimize search results
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Learning Rate: {learningRate}
                      </label>
                      <Slider
                        value={[learningRate * 100]}
                        min={1}
                        max={50}
                        step={1}
                        onValueChange={(values) => setLearningRate(values[0] / 100)}
                        className="w-full"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Controls how quickly the model adapts (0.01-0.5)
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Training Epochs: {epochs}
                      </label>
                      <Slider
                        value={[epochs]}
                        min={10}
                        max={200}
                        step={10}
                        onValueChange={(values) => setEpochs(values[0])}
                        className="w-full"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Number of training iterations (10-200)
                      </p>
                    </div>
                    
                    <div className="bg-gray-100 p-4 rounded">
                      <h3 className="font-medium mb-2">Training Stats</h3>
                      <ul className="text-sm space-y-1">
                        <li>Training examples: {trainingData.length}</li>
                        <li>Products available: {products.length}</li>
                        <li>Estimated training time: {Math.ceil(trainingData.length * epochs * 0.02)} seconds</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="outline"
                    onClick={() => navigate("/search")}
                  >
                    Back to Search
                  </Button>
                  <Button 
                    onClick={handleStartTraining}
                    disabled={isTraining || trainingData.length === 0}
                  >
                    {isTraining ? "Training..." : "Start Training"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="model-weights">
              <Card>
                <CardHeader>
                  <CardTitle>Model Weights</CardTitle>
                  <CardDescription>
                    View and manually adjust the weights used by the search algorithm
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Exact Match Weight: {modelWeights.exactMatchWeight.toFixed(2)}
                      </label>
                      <Slider
                        value={[modelWeights.exactMatchWeight * 10]}
                        min={1}
                        max={50}
                        step={1}
                        onValueChange={(values) => setModelWeights(prev => ({
                          ...prev, 
                          exactMatchWeight: values[0] / 10
                        }))}
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        BM25 Text Relevance Weight: {modelWeights.bm25Weight.toFixed(2)}
                      </label>
                      <Slider
                        value={[modelWeights.bm25Weight * 10]}
                        min={1}
                        max={50}
                        step={1}
                        onValueChange={(values) => setModelWeights(prev => ({
                          ...prev, 
                          bm25Weight: values[0] / 10
                        }))}
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Semantic Similarity Weight: {modelWeights.semanticWeight.toFixed(2)}
                      </label>
                      <Slider
                        value={[modelWeights.semanticWeight * 10]}
                        min={1}
                        max={50}
                        step={1}
                        onValueChange={(values) => setModelWeights(prev => ({
                          ...prev, 
                          semanticWeight: values[0] / 10
                        }))}
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Popularity Weight: {modelWeights.popularityWeight.toFixed(2)}
                      </label>
                      <Slider
                        value={[modelWeights.popularityWeight * 10]}
                        min={1}
                        max={50}
                        step={1}
                        onValueChange={(values) => setModelWeights(prev => ({
                          ...prev, 
                          popularityWeight: values[0] / 10
                        }))}
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Recency/Special Features Weight: {modelWeights.recencyWeight.toFixed(2)}
                      </label>
                      <Slider
                        value={[modelWeights.recencyWeight * 10]}
                        min={1}
                        max={50}
                        step={1}
                        onValueChange={(values) => setModelWeights(prev => ({
                          ...prev, 
                          recencyWeight: values[0] / 10
                        }))}
                        className="w-full"
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={handleManualWeightUpdate}
                    className="w-full"
                  >
                    Save Weights
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ModelTraining;
